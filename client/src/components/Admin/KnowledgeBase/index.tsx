import ParaText from '@/app/commonUl/ParaText'
import TextEditor from '@/app/commonUl/TextEditor'
import AuthContext from '@/contexts/AuthContext'
import { addUpdateKnowledgeBase } from '@/lib/adminApi'
import ErrorHandler from '@/lib/ErrorHandler'
import { validationRules } from '@/lib/validations'
import { Button, Col, Drawer, Form, Input, message, Row, Select } from 'antd'
import React, { useContext, useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa'
import KnowledgeTable from './KnowledgeTable'

interface Props {
    activeKey: string;
}

export default function KnowledgeBase({ activeKey }: Props) {
    const [drawer, setDrawer] = useState(false);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [baseId, setBaseId] = useState('');
    const [reload, setReload] = useState(false);
    const [description, setDescription] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const handleItems = () => {
        setDrawer(true);
        form.resetFields();
        setBaseId('');
    }

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            values.userId = user?._id;
            values.baseId = baseId || '';
            const res = await addUpdateKnowledgeBase(values);
            if (res.status == true) {
                message.success(res.message);
                form.resetFields();
                setDrawer(false);
                setLoading(false);
                setReload(!reload);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    const handleEdit = (data: any) => {
        setBaseId(data._id);
        setDescription(data.description)
        setDrawer(true);
        form.setFieldsValue({
            title: data.title,
            youtubeLink: data.youtubeLink,
            description: data.description,
            category: data.category,
            baseId: data._id,
        });
    };

    const handleQuillChange = (content: string) => {
        setDescription(content);
        form.setFieldsValue({
            description: content
        });
    };

    return (
        <>
            <div className="smallTopMargin"></div>
            <Row gutter={8}>
                <Col md={17}>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        Knowledge Base
                    </ParaText>
                </Col>
                <Col md={4}>
                    <Form.Item>
                        <Select
                            style={{ height: '40px' }}
                            placeholder="Select category"
                            allowClear
                            options={[
                                { label: 'Getting Started', value: 'Getting Started' },
                                { label: 'Account Management', value: 'Account Management' },
                                { label: 'Product Features', value: 'Product Features' },
                                { label: 'Troubleshooting', value: 'Troubleshooting' },
                                { label: 'Billing and Payments', value: 'Billing and Payments' },
                                { label: 'Usage Tips', value: 'Usage Tips' },
                                { label: 'Updates and Announcements', value: 'Updates and Announcements' },
                                { label: 'Developer Resources', value: 'Developer Resources' },
                                { label: 'Policies and Compliance', value: 'Policies and Compliance' },
                                { label: 'Community and Support', value: 'Community and Support' }
                            ]}
                            onChange={(value: string) => {
                                setSearchQuery(value);
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col md={2} className={'textEnd'}>
                    <Button icon={<FaPlus />} type={'primary'} onClick={handleItems} >
                        Add Item
                    </Button>
                </Col>
            </Row>
            <div className="largeTopMargin"></div>
            <KnowledgeTable searchQuery={searchQuery} activeKey={activeKey} reload={reload} onEdit={(data: any) => handleEdit(data)} />
            <Drawer width={640} title={baseId ? 'Edit item' : "Add article"} onClose={() => setDrawer(false)} open={drawer}>
                <Form
                    layout='vertical'
                    size='large'
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={10}>
                        <Col md={12}>
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter title'
                                    },
                                    {
                                        max: validationRules.textLength.maxLength,
                                        message: `Title must be at most ${validationRules.textLength.maxLength} characters`
                                    }
                                ]}
                            >
                                <Input placeholder='Enter title' maxLength={50} />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter title'
                                    }
                                ]}
                            >
                                <Select
                                    placeholder="Select category"
                                    allowClear
                                    options={[
                                        { label: 'Getting Started', value: 'Getting Started' },
                                        { label: 'Account Management', value: 'Account Management' },
                                        { label: 'Product Features', value: 'Product Features' },
                                        { label: 'Troubleshooting', value: 'Troubleshooting' },
                                        { label: 'Billing and Payments', value: 'Billing and Payments' },
                                        { label: 'Usage Tips', value: 'Usage Tips' },
                                        { label: 'Updates and Announcements', value: 'Updates and Announcements' },
                                        { label: 'Developer Resources', value: 'Developer Resources' },
                                        { label: 'Policies and Compliance', value: 'Policies and Compliance' },
                                        { label: 'Community and Support', value: 'Community and Support' }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <Form.Item
                                label="Youtube Video Link"
                                name="youtubeLink"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a valid YouTube URL'
                                    },
                                    {
                                        pattern: /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/)|youtu\.be\/).+$/,
                                        message: 'Please enter a valid YouTube URL'
                                    }
                                ]}
                            >
                                <Input placeholder='Enter link' style={{ textTransform: 'none' }} />
                            </Form.Item>



                        </Col>
                        <Col md={24}>
                            <Form.Item
                                label=""
                                name="description"

                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Description!'
                                    }

                                ]}
                            >
                                <TextEditor
                                    theme="snow"
                                    value={description}
                                    onChange={handleQuillChange}
                                    height={200}
                                />

                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <div style={{ textAlign: 'end' }}>
                                <Button type='primary' loading={loading} htmlType='submit'>
                                    {loading ? 'Submitting' : 'Submit Article'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    )
}
