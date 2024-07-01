'use client'
import ParaText from '@/app/commonUl/ParaText'
import AuthContext from '@/contexts/AuthContext';
import { getSingleBrandDetails, updatePaymentDetails } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import { Button, Col, Form, Input, message, Row, Select } from 'antd'
import React, { useContext, useEffect, useState } from 'react'

interface Props {
    activeKey: string;
}

export default function Payment({ activeKey }: Props) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [brandId, setBrandId] = useState('')
    const [form] = Form.useForm();

    useEffect(() => {
        if (activeKey == '2') {
            if (user) fetchPaymentDetail(user?._id || '');
        }
    }, [activeKey, user?._id])

    const fetchPaymentDetail = async (id: string) => {
        try {
            const data = {
                userId: id
            }
            const res = await getSingleBrandDetails(data);
            console.log(res, '00000')
            if (res.status == true) {
                setBrandId(res.data._id);
                form.setFieldsValue({
                    stripeTestKey: res.data.payment.stripeTestKey,
                    stripeLiveKey: res.data.payment.stripeLiveKey,
                    paypalTestKey: res.data.payment.paypalTestKey,
                    paypalLiveKey: res.data.payment.paypalLiveKey,
                    paymentMode: res.data.payment.paymentMode
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
            const res = await updatePaymentDetails(values);
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
            <div className="smallTopMargin"></div>
            <Form layout='vertical' form={form} size='large' onFinish={onfinish}>
                <Row>
                    <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                        <ParaText size="large" fontWeightBold={600} color="primaryColor">
                            Stripe Keys
                        </ParaText>
                        <Row gutter={[14, 14]}>
                            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name={'stripeTestKey'} label='Stripe Test Keys'
                                    rules={[
                                        {
                                            pattern: validationRules.stripeKeys.pattern,
                                            message: 'Please enter a valid stripe keys',
                                        },
                                        {
                                            max: validationRules.textLength.maxLength,
                                            message: `Stripe key must be at most ${validationRules.textLength.maxLength} characters`
                                        },

                                    ]}
                                >
                                    <Input
                                        type='text'
                                        placeholder='Enter stripe test keys'
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name={'stripeLiveKey'} label='Stripe Live Keys'
                                    rules={
                                        [
                                            {
                                                pattern: validationRules.stripeKeys.pattern,
                                                message: 'Please enter a valid stripe keys',
                                            },
                                            {
                                                max: validationRules.stripeKeys.maxLength,
                                                message: `Stripe key must be at most ${validationRules.stripeKeys.maxLength} characters`
                                            },

                                        ]
                                    }
                                >
                                    <Input
                                        type='text'
                                        placeholder='Enter stripe live keys'
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <ParaText size="large" fontWeightBold={600} color="primaryColor">
                                    Paypal Keys
                                </ParaText>
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name={'paypalTestKey'} label='Paypal Test Key'
                                    rules={
                                        [
                                            {
                                                pattern: validationRules.paypalKeys.pattern,
                                                message: 'Please enter a valid paypal keys',
                                            },
                                            {
                                                max: validationRules.paypalKeys.maxLength,
                                                message: `Paypal key must be at most ${validationRules.paypalKeys.maxLength} characters`
                                            },

                                        ]
                                    }
                                >
                                    <Input
                                        type='text'
                                        placeholder='Enter paypal test key'
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                                <Form.Item name={'paypalLiveKey'} label='Paypal Live Key'
                                    rules={
                                        [
                                            {
                                                pattern: validationRules.paypalKeys.pattern,
                                                message: 'Please enter a valid paypal keys',
                                            },
                                            {
                                                max: validationRules.paypalKeys.maxLength,
                                                message: `Paypal key must be at most ${validationRules.paypalKeys.maxLength} characters`
                                            },

                                        ]
                                    }
                                >
                                    <Input
                                        type='text'
                                        placeholder='Enter paypal live key'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}></Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <ParaText size="large" fontWeightBold={600} color="primaryColor">
                            Payment Gateway Integration
                        </ParaText>
                        <Row >
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item name={'paymentMode'} label={'Payment Mode'}
                                    rules={
                                        [{
                                            required: true,
                                            message: 'Please select payment mode'
                                        }]
                                    }
                                >

                                    <Select
                                        size="large"
                                        defaultValue={'test'}
                                        style={{ width: '100%', textAlign: 'left' }}
                                        options={[
                                            {
                                                value: 'test',
                                                label: 'Test'
                                            },
                                            {
                                                value: 'live',
                                                label: 'Live'
                                            },
                                        ]}
                                        placeholder='Select payment mode'
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={8} style={{ textAlign: 'end' }}>
                        <ParaText size="large" fontWeightBold={600} color="primaryColor">
                            {''}
                        </ParaText>
                        <div className="largeTopMargin"></div>
                        <div style={{ paddingTop: '50px' }}>
                            <Button type='primary' htmlType='submit' loading={loading}>{loading ? 'Submitting' : 'Submit Stripe Keys'}</Button>
                        </div>
                    </Col>
                </Row>
            </Form >
        </>
    )
}
