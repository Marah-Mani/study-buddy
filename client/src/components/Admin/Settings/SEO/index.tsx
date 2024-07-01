import ParaText from '@/app/commonUl/ParaText'
import AuthContext from '@/contexts/AuthContext';
import { getSingleBrandDetails, updateSEODetails } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Button, Col, Form, Input, message, Row } from 'antd'
import React, { useContext, useEffect, useState } from 'react';
import { validationRules } from '@/lib/validations';

interface Props {
    activeKey: string;
}

export default function SEO({ activeKey }: Props) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [brandId, setBrandId] = useState('')
    const [form] = Form.useForm();

    useEffect(() => {
        if (activeKey == '3') {
            if (user) fetchSEODetail(user?._id || '');
        }
    }, [activeKey, user?._id])

    const fetchSEODetail = async (id: string) => {
        try {
            const data = {
                userId: id
            }
            const res = await getSingleBrandDetails(data);
            if (res.status == true) {
                setBrandId(res.data._id);
                form.setFieldsValue({
                    googleAnalytics: res.data.seo.googleAnalytics,
                    searchConsole: res.data.seo.searchConsole,
                    hotJar: res.data.seo.hotJar,
                    mailChimp: res.data.seo.mailChimp,
                })
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const onfinish = async (values: any) => {
        try {
            setLoading(true);
            values.userId = user?._id || '';
            const res = await updateSEODetails(values);
            if (res.status == true) {
                message.success(res.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="primaryColor">
                SEO Integration
            </ParaText>
            <div className="smallTopMargin"></div>
            <Row >
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <Form layout='vertical' form={form} size='large' onFinish={onfinish} >
                        <Row >
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name={'googleAnalytics'}
                                    label={'Google Analytics'}
                                // rules={[
                                //     {
                                //         pattern: /^UA-\d{8,}-\d{1,}$/,
                                //         message: 'Please enter a valid Google Analytics tracking ID',
                                //     },
                                // ]}
                                >
                                    <Input
                                        type='text'
                                        maxLength={50}
                                        placeholder='Enter Google Analytics ID (G-XXXXXXX)'
                                    />
                                </Form.Item>

                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name={'searchConsole'}
                                    label={'Search Console'}
                                // rules={[
                                //     {
                                //         pattern: /^[a-zA-Z0-9_-]{3,20}$/,
                                //         message: 'Please enter a valid Search Console code',
                                //     },
                                // ]}
                                >
                                    <Input
                                        type='text'
                                        maxLength={50}
                                        placeholder='Enter Search Console code'
                                    />
                                </Form.Item>

                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name={'hotJar'}
                                    label={'Hot-jar'}
                                // rules={[
                                //     {
                                //         pattern: /^[a-zA-Z0-9]{9}$/,
                                //         message: 'Please enter a valid hot-jar code',
                                //     },
                                // ]}
                                >
                                    <Input
                                        type='text'
                                        maxLength={50}
                                        placeholder='Enter  hot-jar code'
                                    />
                                </Form.Item>

                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name={'mailChimp'}
                                    label={'Mailchimp'}
                                // rules={[
                                //     {
                                //         pattern: /^[a-zA-Z0-9]{32}$/,
                                //         message: 'Please enter a valid Mailchimp code',
                                //     },
                                // ]}
                                >
                                    <Input
                                        type='text'
                                        maxLength={50}
                                        placeholder='Enter Mailchimp code'
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={24} style={{ textAlign: 'end' }}>
                                <div className="smallTopMargin"></div>
                                <Button type='primary' htmlType='submit' loading={loading}>{loading ? 'Submitting' : 'Submit Seo Integration'}</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col xl={16} lg={16} md={16} sm={24} xs={24}></Col>
            </Row>
        </>
    )
}
