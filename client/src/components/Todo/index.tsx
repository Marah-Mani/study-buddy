"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Col, Row, Menu, Button, Input, Modal, Form, message, Select, DatePicker, Card, Space, Avatar, Tag, Popconfirm, Tooltip, Spin, InputNumber, Checkbox } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import TodoSidebar from '@/components/TodoSidebar';
import { EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';
import { addUpdateTodo, deleteTodo, getAllTodo, getAllUsers } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import Meta from 'antd/es/card/Meta';
import dayjs from 'dayjs';
import PlaceholderNoData from '@/app/commonUl/PlaceholderNoData';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { RRule } from 'rrule';
const { Option } = Select;

const Todo = () => {
	const [form] = Form.useForm();
	const [allTask, setAllTask] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [allUsers, setAllUsers] = useState([]);
	const { user } = useContext(AuthContext);
	const [editTaskId, setEditTaskId] = useState<any>();
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [defaultSelectedUsers, setDefaultSelectedUsers] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [eventType, setEventType] = useState('');
	const [recurrenceType, setRecurrenceType] = useState('');


	const handleChange = () => {
		setDropdownVisible(false); // Close the dropdown
	};


	useEffect(() => {
		fetchAllUsers();
		if (user && user?._id) {
			setLoading(false)
			setDefaultSelectedUsers([user?._id?.toString()])
		}
	}, [user]);

	const initialValues = {
		assignedTo: defaultSelectedUsers,
	};

	useEffect(() => {
		fetchAllTask();
	}, []);

	const fetchAllUsers = async () => {
		try {
			const response = await getAllUsers();
			setAllUsers(response.data);
		} catch (error) {
			console.error('Error fetching authors:', error);
		}
	};

	const fetchAllTask = async () => {
		try {
			const response = await getAllTodo();
			setAllTask(response.data);
		} catch (error) {
			console.error('Error fetching authors:', error);
		}
	};

	const showModal = () => {
		setEditTaskId(null);
		form.resetFields();
		setIsModalVisible(true);
		setEventType('');
		setRecurrenceType('');
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setEventType('');
		setRecurrenceType('');
	};

	const handleEdit = (taskId: string) => {
		setIsModalVisible(true);
		setEditTaskId(taskId);
		const editedTask = allTask.find((task: any) => task._id === taskId) as any;
		const assignedTo = editedTask.assignedTo.map((assignee: any) => assignee._id || assignee);

		if (editedTask) {
			if (editedTask.recurrenceType && editedTask.recurrenceType !== 'NONE') {
				setEventType("Recurring");
				setRecurrenceType(editedTask.recurrenceType);

				// Parse the recurrence rule
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
				setEventType("One Time");
				setRecurrenceType('');
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

	const handleDelete = async (taskId: string) => {
		const deleteData = {
			userId: user?._id,
			id: taskId
		}
		const res = await deleteTodo(deleteData);
		if (res.status == true) {
			message.success(res.message);
			fetchAllTask();
		} else {
			message.error(res.message);
		}
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
				values = { ...values, todoId: editTaskId };
			}

			values = { ...values, createdBy: user?._id };
			const res = await addUpdateTodo(values);
			if (res.status == true) {
				message.success(res.message);
				fetchAllTask();
			} else {
				message.error(res.message);
			}
			setIsModalVisible(false);
		} catch (error) {
			console.error('Error adding todo:', error);
		}
	};

	const fetchFilteredTasks = async (query: any) => {
		try {
			const response = await getAllTodo(query);
			setAllTask(response.data);
		} catch (error) {
			console.error('Error fetching tasks:', error);
		}
	};

	const handleEventTypeChange = (value: any) => {
		setEventType(value);
	};

	const handleRecurrenceTypeChange = (value: any) => {
		setRecurrenceType(value);
	};

	const generateOccurrences = (rule: any, startDate: any, endDate: any) => {
		const rrule = RRule.fromString(rule);
		const options = {
			dtstart: new Date(startDate),
			until: new Date(endDate)
		};
		const occurrences = rrule.between(options.dtstart, options.until).map(date => date.toLocaleString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		}));

		return occurrences.map((occurrence, index) => {
			if (index !== occurrences.length - 1) {
				return `${occurrence},`;
			} else {
				return occurrence;
			}
		}).join('<br/>');
	};

	return (
		<>
			{loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
				<Spin style={{ marginTop: '-20vh' }} />
			</div>
				:
				<Row gutter={[24, 24]} style={{ marginTop: '100px' }}>
					<Col sm={24} xs={24} md={24} lg={24} xl={4} xxl={4}>
						<Button type='primary' style={{ width: '100%' }} onClick={showModal}>Create New Task</Button>
						<TodoSidebar fetchTasks={fetchFilteredTasks} />
					</Col>
					<Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={20}>
						<Row gutter={[16, 16]} className='boxInbox'>
							<Col span={24}>
								<ParaText size="large" fontWeightBold={600} color="primaryColor">
									Tasks
								</ParaText>
							</Col>
							<Col span={24}>
								<Row gutter={[16, 16]}>
									{allTask && allTask.length > 0 ? (
										allTask.map((task: any) => (
											<Col key={task.id} xs={24} sm={12} md={8} lg={8} xl={8}>
												<Card
													style={{ borderRadius: '8px', borderLeft: '4px solid #1890ff', marginBottom: '16px' }}
												>
													<Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
														<Col span={4}>
															<Tag color={
																task.priority === 'High' ? "gold-inverse" :
																	task.priority === 'Medium' ? 'blue-inverse' :
																		task.priority === "Low" ? "green-inverse" :
																			task.priority === "Critical" ? "red-inverse" :
																				'green'
															}>
																{task.priority}
															</Tag>
														</Col>
														{task?.createdBy?._id !== user?._id && (
															<Col span={16}>
																<Tag color="green">
																	<div>Assigned By: <strong>{task?.createdBy?.name}</strong></div>
																</Tag>
															</Col>
														)}
														<Col span={4}>
															<EditOutlined
																style={{ fontSize: '18px', cursor: 'pointer', paddingRight: '10px' }}
																onClick={() => handleEdit(task._id)}
															/>
															<Popconfirm
																title="Are you sure you want to delete this task?"
																onConfirm={() => handleDelete(task._id)}
																okText="Yes"
																cancelText="No"
															>
																<DeleteOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
															</Popconfirm>
														</Col>
													</Row>
													<Meta
														title={task.title}
														description={
															<div>
																<Row style={{ marginBottom: '8px' }}>
																	<Col span={24}>
																		<div>Date: {new Date(task.assignedDate).toLocaleDateString()} - {new Date(task.targetDate).toLocaleDateString()} {" "} {new Date(task.targetDate) < new Date() ? (
																			<>
																				<ExclamationCircleOutlined style={{ color: 'red' }} />
																				<span style={{ color: 'red' }}> Expired</span>
																			</>
																		) : ''}</div>
																	</Col>
																</Row>

																<Row style={{ marginBottom: '8px', display: 'flex' }}>
																	<div style={{ marginRight: '8px' }}>
																		Event Type: {task.recurrenceType === 'NONE' ? 'One Time' : task.recurrenceType}
																	</div>
																	{task.recurrenceType !== 'NONE' && (
																		<div>
																			<Tooltip
																				title={
																					<span dangerouslySetInnerHTML={{ __html: generateOccurrences(task.recurrenceRule, task.assignedDate, task.targetDate) }} />
																				}
																			>
																				<div>
																					<Tag color="green">Repeats On</Tag>
																				</div>
																			</Tooltip>
																		</div>
																	)}
																</Row>

																<Row style={{ marginBottom: '8px' }}>
																	<Col span={6}>
																		<div>Assigned To:</div>
																	</Col>
																	<Col span={14}>
																		<Avatar.Group maxCount={3}>
																			{task.assignedTo.map((assignedUser: any, index: number) => (
																				<Tooltip title={assignedUser.name} key={index}>
																					{assignedUser.image ? (
																						<Avatar
																							src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/small/${assignedUser.image}`}
																							style={{ cursor: 'pointer' }}
																						/>
																					) : (
																						<Avatar
																							src="/images/avatar.png"
																							style={{ cursor: 'pointer' }}
																						/>
																					)}
																				</Tooltip>
																			))}
																		</Avatar.Group>
																	</Col>
																</Row>
															</div>
														}
													/>
												</Card>
											</Col>
										))
									) : (
										<Col span={24} >
											<PlaceholderNoData message="No Task found" />
										</Col>
									)}
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			}
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
		</>
	);
}

export default Todo;
