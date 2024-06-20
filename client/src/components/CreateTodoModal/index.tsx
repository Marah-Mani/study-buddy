import AuthContext from '@/contexts/AuthContext';
import { addUpdateTodo, getAllUsers } from '@/lib/commonApi';
import { Button, Col, DatePicker, Form, Input, Modal, Row, Select, message } from 'antd';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs';
const { Option } = Select

interface CreateTodoModalProps {
    editTaskId?: string;
    isModalVisible: boolean;
    handleCancel: () => void;
    initialValues?: any;
    handleChange?: any;
    allTask?: any;
    eventType?: any;
    setIsModalVisible?: any;
    setReload?: any;
    reload?: boolean;
    chatId?: string | null;
}

export default function CreateTodoModal({
    editTaskId,
    isModalVisible,
    handleCancel,
    initialValues,
    handleChange,
    setIsModalVisible,
    setReload,
    reload,
    chatId,
    allTask

}: CreateTodoModalProps) {
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [defaultSelectedUsers, setDefaultSelectedUsers] = useState<string[]>([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [recurrenceType, setRecurrenceType] = useState('');
    const [eventType, setEventType] = useState('');

    const handleEventTypeChange = (value: any) => {
        setEventType(value);
    };

    useEffect(() => {
        fetchAllUsers();
        if (user && user?._id) {
            setLoading(false)
            setDefaultSelectedUsers([user?._id?.toString()])
        }
    }, [user]);

    useEffect(() => {
        if (editTaskId) {
            handleEdit(editTaskId)
        } else {
            form.resetFields()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editTaskId])

    const fetchAllUsers = async () => {
        try {
            const response = await getAllUsers();
            setAllUsers(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    const handleRecurrenceTypeChange = (value: any) => {
        setRecurrenceType(value);
    };

    const onFinish = async (values: any) => {
        try {

            if (values.recurrenceType) {
                switch (values.recurrenceType) {
                    case 'DAILY':
                        if (values.dateRange[0] && values.dateRange[1]) {
                            const startDate = dayjs(values.dateRange[0]);
                            const endDate = dayjs(values.dateRange[1]);
                            const untilDate = endDate.endOf('day').format('YYYYMMDD[T]HHmmss[Z]');
                            values.recurrenceDetails = {
                                type: 'DAILY',
                                rule: `RRULE:FREQ=DAILY;UNTIL=${untilDate}`
                            };
                        }
                        break;
                    case 'WEEKLY':
                        if (values.weeklyRecurrence && values.dateRange) {
                            const selectedDays = values.weeklyRecurrence.join(',');
                            const startDate = dayjs(values.dateRange[0]);
                            const endDate = dayjs(values.dateRange[1]);

                            const untilDate = endDate.endOf('day').format('YYYYMMDD[T]HHmmss[Z]');

                            values.recurrenceDetails = {
                                type: 'WEEKLY',
                                rule: `RRULE:FREQ=WEEKLY;BYDAY=${selectedDays};UNTIL=${untilDate}`,
                            };
                        }
                        break;
                    case 'MONTHLY':
                        if (values.monthlyRecurrenceDay && values.dateRange[0] && values.dateRange[1]) {
                            const dayOfMonth = values.monthlyRecurrenceDay.date();
                            const startDate = dayjs(values.dateRange[0]);
                            const endDate = dayjs(values.dateRange[1]);
                            const untilDate = endDate.endOf('day').format('YYYYMMDD[T]HHmmss[Z]');
                            values.recurrenceDetails = {
                                type: 'MONTHLY',
                                rule: `RRULE:FREQ=MONTHLY;BYMONTHDAY=${dayOfMonth};UNTIL=${untilDate}`
                            };
                        }
                        break;
                    case 'YEARLY':
                        if (values.yearlyRecurrenceDate && values.dateRange[0] && values.dateRange[1]) {
                            const month = values.yearlyRecurrenceDate.format('MM');
                            const dayOfMonth = values.yearlyRecurrenceDate.format('DD');
                            const startDate = dayjs(values.dateRange[0]);
                            const endDate = dayjs(values.dateRange[1]);
                            const untilDate = endDate.endOf('day').format('YYYYMMDD[T]HHmmss[Z]');
                            values.recurrenceDetails = {
                                type: 'YEARLY',
                                rule: `RRULE:FREQ=YEARLY;BYMONTH=${month};BYMONTHDAY=${dayOfMonth};UNTIL=${untilDate}`
                            };
                        }
                        break;
                }
            }

            if (editTaskId) {
                values = { ...values, todoId: editTaskId, chatId: chatId };
            }

            values = { ...values, createdBy: user?._id, chatId: chatId };
            const res = await addUpdateTodo(values);
            if (res.status == true) {
                message.success(res.message);
                setReload(!reload)
            } else {
                message.error(res.message);
            }
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleEdit = (taskId: string) => {
        const editedTask = allTask.find((task: any) => task._id === taskId) as any;
        const assignedTo = editedTask.assignedTo.map((assignee: any) => assignee._id || assignee);

        if (editedTask) {
            if (editedTask.recurrenceType && editedTask.recurrenceType !== 'NONE') {
                const ruleParts = editedTask.recurrenceRule.split(';');
                let recurrenceFields: any = {};

                ruleParts.forEach((part: any) => {
                    const [key, value] = part.split('=');
                    switch (key) {
                        case 'BYDAY':
                            recurrenceFields.weeklyRecurrence = value.split(',');
                            break;
                        case 'BYMONTHDAY':
                            recurrenceFields.monthlyRecurrenceDay = dayjs().date(parseInt(value));
                            break;
                        case 'BYMONTH':
                            recurrenceFields.yearlyRecurrenceDate = dayjs().month(parseInt(value) - 1).date(editedTask.recurrenceRule.match(/BYMONTHDAY=(\d+)/)[1]);
                            break;
                        default:
                            break;
                    }
                });

                form.setFieldsValue({
                    ...recurrenceFields,
                    eventType: 'Recurring',
                    recurrenceType: editedTask.recurrenceType,
                    title: editedTask?.title,
                    description: editedTask?.description,
                    assignedTo: assignedTo,
                    category: editedTask?.category,
                    dateRange: [dayjs(editedTask?.assignedDate), dayjs(editedTask?.targetDate)],
                    status: editedTask?.status,
                    priority: editedTask?.priority,
                });
            } else {
                form.setFieldsValue({
                    eventType: 'One Time',
                    title: editedTask?.title,
                    description: editedTask?.description,
                    assignedTo: assignedTo,
                    category: editedTask?.category,
                    dateRange: [dayjs(editedTask?.assignedDate), dayjs(editedTask?.targetDate)],
                    status: editedTask?.status,
                    priority: editedTask?.priority,
                    recurrenceType: null,
                    weeklyRecurrence: [],
                    monthlyRecurrenceDay: null,
                    yearlyRecurrenceDate: null
                });
            }
        } else {
            form.resetFields();
        }
    };

    return (
        <Modal
            title={editTaskId ? "Update Todo" : "Create New Task"}
            open={isModalVisible}
            width={700}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                name="createTask"
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                initialValues={initialValues}

            >
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        { required: true, message: 'Please input the title!' },
                        { max: 29, message: 'Title cannot exceed 30 characters!' }
                    ]}
                >
                    <Input
                        placeholder="Enter task title"
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            let inputValue = target.value;
                            inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

                            if (inputValue.length > 30) {
                                inputValue = inputValue.slice(0, 30);
                            }
                            target.value = inputValue;
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        { required: true, message: 'Please input the description' },
                        { max: 199, message: 'Description cannot exceed 200 characters!' }
                    ]}
                >
                    <Input.TextArea
                        placeholder="Enter task description"
                        onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            let inputValue = target.value;
                            inputValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

                            if (inputValue.length > 200) {
                                inputValue = inputValue.slice(0, 200);
                            }

                            target.value = inputValue;
                        }}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Category"
                            name="category"
                            rules={[{ required: true, message: 'Please select the Category!' }]}
                        >
                            <Select placeholder="Select Category">
                                <Option value="personal">Personal</Option>
                                <Option value="work">Work</Option>
                                <Option value="health_and_fitness">Health & Fitness</Option>
                                <Option value="daily_goals">Daily Goals</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Assigned To"
                            name="assignedTo"
                            rules={[{ required: true, message: 'Please select at least one user!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Select users"
                                maxTagCount="responsive"
                                style={{ width: '100%' }}
                                onChange={handleChange}
                                onDropdownVisibleChange={(open) => setDropdownVisible(open)}
                                open={dropdownVisible}
                                value={defaultSelectedUsers}
                            >
                                {allUsers.map((item: any) => (
                                    <Option key={item._id} value={item._id.toString()}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Start Date - Target Date"
                            name="dateRange"
                            rules={[
                                { required: true, message: 'Please select the date range!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        const startDate = value[0];
                                        const endDate = value[1];
                                        if (startDate && endDate && startDate.isSame(endDate, 'minute')) {
                                            return Promise.reject('Start Date and End Date cannot be the same!');
                                        }
                                        return Promise.resolve();
                                    },
                                }),
                            ]}
                        >
                            <DatePicker.RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                picker="date"
                                style={{ width: '100%' }}
                                inputReadOnly
                                // onFocus={(e) => e.target.blur()} // This prevents the keyboard from appearing on mobile devices
                                disabledDate={(current) => current && current < moment().startOf('day')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: 'Please select the status!' }]}
                        >
                            <Select placeholder="Select status">
                                <Option value="pending">Pending</Option>
                                <Option value="in_progress">In Progress</Option>
                                <Option value="completed">Completed</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>


                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Priority"
                            name="priority"
                            rules={[{ required: true, message: 'Please select the priority!' }]}
                        >
                            <Select placeholder="Select priority">
                                <Option value="Low">Low</Option>
                                <Option value="Medium">Medium</Option>
                                <Option value="High">High</Option>
                                <Option value="Critical">Critical</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Event Type"
                            name="eventType"
                            rules={[{ required: true, message: 'Please select the event type!' }]}
                        >
                            <Select placeholder="Select event type" onChange={handleEventTypeChange}>
                                <Option value="One Time">One Time</Option>
                                <Option value="Recurring">Recurring</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {eventType === 'Recurring' && (
                    <>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Recurrence Type"
                                    name="recurrenceType"
                                    rules={[{ required: true, message: 'Please select the recurrence type!' }]}
                                >
                                    <Select placeholder="Select recurrence type" onChange={handleRecurrenceTypeChange}>
                                        <Option value="DAILY">Daily</Option>
                                        <Option value="WEEKLY">Weekly</Option>
                                        <Option value="MONTHLY">Monthly</Option>
                                        <Option value="YEARLY">Yearly</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                {recurrenceType === 'DAILY' && (
                                    <></>
                                )}

                                {recurrenceType === 'WEEKLY' && (
                                    <Form.Item
                                        label="Weekly Recurrence Rule"
                                        name="weeklyRecurrence"
                                        rules={[{ required: true, message: 'Please input the weekly recurrence rule!' }]}
                                    >
                                        <Select
                                            placeholder="Select days for weekly recurrence"
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                        >
                                            <Select.Option value="MO">Monday</Select.Option>
                                            <Select.Option value="TU">Tuesday</Select.Option>
                                            <Select.Option value="WE">Wednesday</Select.Option>
                                            <Select.Option value="TH">Thursday</Select.Option>
                                            <Select.Option value="FR">Friday</Select.Option>
                                            <Select.Option value="SA">Saturday</Select.Option>
                                            <Select.Option value="SU">Sunday</Select.Option>
                                        </Select>
                                    </Form.Item>
                                )}

                                {recurrenceType === 'MONTHLY' && (
                                    <>
                                        <Form.Item
                                            label="Monthly Recurrence Day"
                                            name="monthlyRecurrenceDay"
                                            rules={[{ required: true, message: 'Please select the day for monthly recurrence!' }]}
                                        >
                                            <DatePicker
                                                placeholder="Select day for monthly recurrence"
                                                style={{ width: '100%' }}
                                                picker="date"
                                                format="DD"
                                            />
                                        </Form.Item>
                                    </>
                                )}

                                {recurrenceType === 'YEARLY' && (
                                    <Form.Item
                                        label="Yearly Recurrence Rule - Date"
                                        name="yearlyRecurrenceDate"
                                        rules={[
                                            { type: 'object', required: true, message: 'Please select the date for yearly recurrence!' }
                                        ]}
                                    >
                                        <DatePicker
                                            placeholder="Select date for yearly recurrence"
                                            format="MMMM DD" // Display format showing both month and day
                                            style={{ width: '100%' }}
                                            picker="date" // Use date picker
                                        />
                                    </Form.Item>
                                )}
                            </Col>
                        </Row>
                    </>
                )}

                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        {editTaskId ? "Update Todo" : "Create Todo"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}
