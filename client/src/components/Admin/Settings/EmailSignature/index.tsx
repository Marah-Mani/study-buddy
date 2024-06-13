import ParaText from '@/app/commonUl/ParaText'
import TextEditor from '@/app/commonUl/TextEditor'
import AuthContext from '@/contexts/AuthContext';
import { getSingleBrandDetails, updateSignature } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Button, Col, Form, message, Row } from 'antd'
import React, { useContext, useEffect, useState } from 'react'

interface Props {
    activeKey: string;
}

export default function EmailSignature({ activeKey }: Props) {
    const { user } = useContext(AuthContext);
    const [signature, setSignature] = useState('');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleQuillChange = (content: string) => {
        setSignature(content);
        form.setFieldsValue({
            description: content
        });
    };
    useEffect(() => {
        if (activeKey == '5') {
            if (user) fetchEmailSignature(user?._id || '');
        }
    }, [activeKey, user?._id])

    const fetchEmailSignature = async (id: string) => {
        try {
            const data = {
                userId: id
            }
            const res = await getSingleBrandDetails(data);
            if (res.status == true) {
                form.setFieldsValue({
                    description: res.data.emailSignature
                });
                setSignature(res.data.emailSignature);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            values.userId = user?._id || '';
            const res = await updateSignature(values);
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
            <div className="smallTopMargin"></div>
            <Form layout='vertical' size='large' form={form} onFinish={onFinish}>
                <Row>
                    <Col xl={16} lg={16} md={16} sm={24} xs={24}>
                        <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                            Email Signature
                        </ParaText>
                        <div className="smallTopMargin"></div>
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
                                value={signature}
                                onChange={handleQuillChange}
                                placeholder="Enter email signature"
                                height={250}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}></Col>
                    <Col md={16} style={{ textAlign: 'end' }}>
                        <Button type='primary' loading={loading} htmlType='submit'>{loading ? 'Submitting' : 'Submit Signature'}</Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
