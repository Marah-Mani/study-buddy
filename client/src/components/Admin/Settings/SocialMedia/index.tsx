'use client'
import ParaText from '@/app/commonUl/ParaText'
import AuthContext from '@/contexts/AuthContext'
import { getSingleBrandDetails, updateSocialLinks } from '@/lib/adminApi'
import ErrorHandler from '@/lib/ErrorHandler'
import { validationRules } from '@/lib/validations'
import { Button, Col, Form, Input, message, Row } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { FaFacebook, FaInstagram, FaLinkedinIn, FaSquareXTwitter } from 'react-icons/fa6'

interface Props {
    activeKey: string;
}
export default function SocialMedia({ activeKey }: Props) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [brandId, setBrandId] = useState('')
    const [form] = Form.useForm();

    useEffect(() => {
        if (activeKey == '4') {
            if (user) fetchSocialLinks(user?._id || '');
        }
    }, [activeKey, user?._id])

    const fetchSocialLinks = async (id: string) => {
        try {
            const data = {
                userId: id
            }
            const res = await getSingleBrandDetails(data);
            if (res.status == true) {
                setBrandId(res.data._id);
                form.setFieldsValue({
                    facebook: res.data.socialLinks.facebook,
                    linkedIn: res.data.socialLinks.linkedIn,
                    twitter: res.data.socialLinks.twitter,
                    instagram: res.data.socialLinks.instagram,
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
            const res = await updateSocialLinks(values);
            if (res.status == true) {
                message.success(res.message)
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }
    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Social Media Links
            </ParaText>
            <div className="smallTopMargin"></div>
            <Row gutter={10}>
                <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                    <Form layout='vertical' form={form} size='large' onFinish={onfinish}>
                        <Row gutter={4}>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name={'facebook'}
                                    label={'Facebook'}
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (!value || validationRules.facebookURL.pattern.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Please enter a valid Facebook URL');
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Enter Facebook link'
                                        type='text'
                                        maxLength={50}
                                        suffix={<FaFacebook />}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name={'twitter'}
                                    label={'Twitter'}
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (!value || validationRules.twitterURL.pattern.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Please enter a valid Twitter URL');
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Enter Twitter link'
                                        type='text'
                                        maxLength={50}
                                        suffix={<FaSquareXTwitter />}
                                    />
                                </Form.Item>

                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name={'linkedIn'}
                                    label={'LinkedIn'}
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (!value || validationRules.linkedinURL.pattern.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Please enter a valid LinkedIn URL');
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Enter LinkedIn link'
                                        type='text'
                                        maxLength={50}
                                        suffix={<FaLinkedinIn />}
                                    />
                                </Form.Item>

                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name={'instagram'}
                                    label={'Instagram'}
                                    rules={[
                                        {
                                            validator: (_, value) => {
                                                if (!value || validationRules.instagramURL.pattern.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Please enter a valid Instagram URL');
                                            },
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder='Enter Instagram link'
                                        type='text'
                                        maxLength={50}
                                        suffix={<FaInstagram />}
                                    />
                                </Form.Item>

                            </Col>
                            <Col md={24} style={{ textAlign: 'end' }}>
                                <div className="smallTopMargin"></div>
                                <Button type='primary' loading={loading} htmlType='submit'>
                                    {loading ? 'Submitting' : 'Submit Media Links'}</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col xl={16} lg={16} md={16} sm={24} xs={24}></Col>
            </Row>
        </>
    )
}
