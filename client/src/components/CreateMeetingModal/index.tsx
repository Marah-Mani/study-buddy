'use client'

import React, { useContext, useState } from 'react';
import { Modal, Form, Input, DatePicker, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import type { FormProps } from 'antd';
import Cookies from 'js-cookie';
import ChatContext from '@/contexts/ChatContext';
import { useForm } from 'antd/es/form/Form';

const { RangePicker } = DatePicker;

interface CreateMeetingModalProps {
    open: any;
    setOpen: any;
    sendMessage: any;
}

const CreateMeetingModal = ({ open, setOpen, sendMessage }: CreateMeetingModalProps) => {
    const { selectedChat }: any = useContext(ChatContext)
    const [loading, setLoading] = useState(false);
    const [form] = useForm();
    type FieldType = {
        title: string;
        description: string;
        dates: [moment.Moment, moment.Moment];
    };

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log('00000')
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/common/zoom`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('session_token')}`,
                }
            });
            const meetingData = response.data;
            if (selectedChat) {
                const messageData = {
                    meetingId: meetingData.id,
                    meetingStartTime: meetingData.start_time,
                    startUrl: meetingData.start_url,
                    joinUrl: meetingData.join_url
                }
                sendMessage(null, meetingData.topic, messageData, 'meeting')
            }
            form.resetFields();
            setOpen(false)
            setLoading(false);
        } catch (error) {
            console.error('Error creating meeting space:', error);
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            centered
            title="Create Meeting"
            footer={null}
            onCancel={() => setOpen(false)}
        >
            <Form
                name="create_meeting"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    name="title"
                    label="Meeting Title"
                    rules={[{ required: true, message: 'Please input the title of the meeting!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="startDate"
                    label="Date and Time"
                    rules={[{ required: true, message: 'Please select the date and time!' }]}
                >
                    <DatePicker
                        showTime
                        style={{ width: "100%" }}
                        format="YYYY-MM-DD HH:mm"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Meeting
                    </Button>
                </Form.Item>
            </Form>

        </Modal>
    );
};

export default CreateMeetingModal;
