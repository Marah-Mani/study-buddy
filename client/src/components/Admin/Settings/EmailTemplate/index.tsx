'use client'
import ParaText from '@/app/commonUl/ParaText';
import TextEditor from '@/app/commonUl/TextEditor';
import AuthContext from '@/contexts/AuthContext';
import { getAllEmailTemplates, updateEmailTemplate } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import { Button, Card, Col, Form, Input, message, Row, Table } from 'antd';
import React, { useContext, useEffect, useState } from 'react';

interface Props {
    activeKey: string;
}

const EmailTemplate = ({ activeKey }: Props) => {
    const { user } = useContext(AuthContext);
    const [templates, setAllTemplates] = useState([]);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [expandedRowKey, setExpandedRowKey] = useState(null);
    const [expandedFormData, setExpandedFormData] = useState({});

    const handleQuillChange = (content: string) => {
        setExpandedFormData(prev => ({ ...prev, template: content }));
        form.setFieldsValue({
            template: content
        });
    };

    useEffect(() => {
        if (activeKey == '2') {
            if (user) fetchTemplate();
        }
    }, [activeKey, user?._id]);


    const fetchTemplate = async () => {
        try {
            const res = await getAllEmailTemplates();
            if (res.status) {
                setAllTemplates(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const templateId = expandedRowKey;
            const res = await updateEmailTemplate({ ...values, templateId });
            if (res.status) {
                message.success(res.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    };

    const columns = [
        {
            key: 'id',
            name: 'Name',
            dataIndex: 'name',
        }
    ];

    const data = templates.map((data: any, index: any) => ({
        key: data._id,
        name: data.name,
        subject: data.subject,
        type: data.type,
        template: data.template,
    }));

    const onExpand = (expanded: boolean, record: any) => {
        if (expanded) {
            setExpandedRowKey(record.key);
            setExpandedFormData(record);
            form.setFieldsValue(record);
        } else {
            setExpandedRowKey(null);
        }
    };

    return (
        <>
            <div className="smallTopMargin"></div>
            <ParaText size="large" fontWeightBold={600} color="primaryColor">
                Email Templates
            </ParaText>
            <Row gutter={16}>
                <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={data}
                        expandable={{
                            expandedRowRender: (record: any) => (
                                <div key={record._id}>
                                    <ParaText size="large" fontWeightBold={600} color="primaryColor">
                                        {record.name}
                                    </ParaText>
                                    <div className="smallTopMargin"></div>
                                    <Form
                                        layout='vertical'
                                        size='large'
                                        form={form}
                                        onFinish={onFinish}
                                    >
                                        <Row gutter={16}>
                                            <Col md={12}>
                                                <Form.Item
                                                    label="Email Template Name"
                                                    name="name"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please enter Name!'
                                                        },
                                                        {
                                                            max: validationRules.textLength.maxLength,
                                                            message: `Name must be at most ${validationRules.textLength.maxLength} characters`
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder='Enter email template name' />
                                                </Form.Item>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Item
                                                    label="Email Template Subject"
                                                    name="subject"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please enter Subject!'
                                                        },
                                                        {
                                                            max: validationRules.textLength.maxLength,
                                                            message: `Subject must be at most ${validationRules.textLength.maxLength} characters`
                                                        }
                                                    ]}
                                                >
                                                    <Input placeholder='Enter email template subject' />
                                                </Form.Item>
                                                <Form.Item
                                                    name="type"
                                                >
                                                    <Input type='hidden' placeholder='Enter email template subject' />
                                                </Form.Item>
                                            </Col>
                                            <Col md={24}>
                                                <Form.Item
                                                    label=""
                                                    name="template"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please enter Description!'
                                                        }
                                                    ]}
                                                >
                                                    <TextEditor
                                                        theme="snow"
                                                        onChange={handleQuillChange}
                                                        placeholder="Enter email template text"
                                                        height={200}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col md={24}>
                                                <div style={{ textAlign: 'end' }}>
                                                    <Button type='primary' loading={loading} htmlType='submit'>
                                                        {loading ? 'Submitting' : 'Submit template'}
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            ),
                            onExpand: onExpand
                        }}
                    />
                </Col>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <div className="largeTopMargin"></div>
                    <Card>
                        <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">
                            Use the variables below in your editor to dynamically format your content. Ensure you use the same format and symbols as shown.
                        </ParaText>
                        <div className="smallTopMargin"></div>
                        <span>
                            *|Name|*  <br /> *|Email|*  <br /> *|Phone|* <br /> *|ResetLink|*
                        </span>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default EmailTemplate;
