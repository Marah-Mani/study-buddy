import ParaText from '@/app/commonUl/ParaText'
import AuthContext from '@/contexts/AuthContext'
import { addUpdateHeaderData } from '@/lib/adminApi'
import ErrorHandler from '@/lib/ErrorHandler'
import { validationRules } from '@/lib/validations'
import { Button, Col, Drawer, Form, Input, message, Row } from 'antd'
import React, { useContext, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import HeaderData from './HeaderData'

interface Props {
    activeKey: string;
}

export default function HeaderMenu({ activeKey }: Props) {
    const [drawer, setDrawer] = useState(false);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [menuId, setMenuId] = useState('');
    const [reload, setReload] = useState(false);
    const handleItems = () => {
        setDrawer(true);
        form.resetFields();
        setMenuId('');
    }

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            values.userId = user?._id;
            values.menuId = menuId || '';
            const res = await addUpdateHeaderData(values);
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
        setMenuId(data._id);
        setDrawer(true);
        form.setFieldsValue({
            title: data.title,
            link: data.link,
            order: data.order,
            menuId: data._id,
        });
    };

    return (
        <>
            <div className="smallTopMargin"></div>
            <Row>
                <Col md={12}>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        Header Menu
                    </ParaText>
                </Col>
                <Col md={10} className={'textEnd'}>
                    <Button icon={<FaPlus />} type={'primary'} onClick={handleItems} >
                        Add Item
                    </Button>
                </Col>
            </Row>
            <div className="largeTopMargin"></div>
            <HeaderData activeKey={activeKey} reload={reload} onEdit={(data: any) => handleEdit(data)} />

            <Drawer title={menuId ? 'Edit item' : "Add new item"} onClose={() => setDrawer(false)} open={drawer}>
                <Form
                    layout='vertical'
                    size='large'
                    form={form}
                    onFinish={onFinish}
                >
                    <Row>
                        <Col md={24}>
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
                                <Input placeholder='Enter title' />
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <Form.Item
                                label="Link"
                                name="link"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter link'
                                    },
                                    {
                                        pattern: validationRules.websiteURL.pattern,
                                        message: 'Please enter a valid link'
                                    }
                                ]}
                            >
                                <Input type='url' placeholder='Enter link' />
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <Form.Item
                                name="order"
                            >
                                <Input type='hidden' />
                            </Form.Item>
                        </Col>
                        <Col md={24}>
                            <div style={{ textAlign: 'end' }}>
                                <Button type='primary' loading={loading} htmlType='submit'>
                                    {loading ? 'Submitting' : 'Submit Item'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    )
}
