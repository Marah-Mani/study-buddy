'use client';
import React, { useState } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import { UserOutlined, MailOutlined, MessageOutlined, AudioOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import { contactUs } from '@/lib/frontendApi';

const ContactUsForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const response = await contactUs(values);
            setLoading(false);
            if (response.status === true) {
                setModalVisible(true);
                form.resetFields();
            } else {
                message.error(response.message || 'Failed to submit contact form.');
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    };

    return (
        <>
            <div style={{ maxWidth: '300px', margin: 'auto', paddingTop: '50px' }}>
                <h1 style={{ textAlign: 'center' }}>Contact Us</h1>
                <Form
                    name="contact_us"
                    onFinish={onFinish}
                    form={form}
                    style={{ paddingTop: '20px' }}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            { required: true, message: 'Please input your name!' },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Your Name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'The input is not a valid email!' },
                        ]}
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Your Email" />
                    </Form.Item>
                    <Form.Item
                        name="message"
                        rules={[
                            { required: true, message: 'Please input your message!' },
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="Your Message" />

                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="contact-form-button" loading={loading}>
                            {loading ? 'Sending...' : 'Submit'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <Modal
                title="Message Sent"
                open={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
            >
                <p>Thank you for contacting us! We will get back to you as soon as possible.</p>
            </Modal>
        </>
    );
};

export default ContactUsForm;
