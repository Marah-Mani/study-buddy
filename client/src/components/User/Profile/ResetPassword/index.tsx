import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { updatePassword } from '@/lib/userApi';
import { LockOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Row } from 'antd'
import React, { useContext, useState } from 'react'


interface Props {
    activeKey: string;
}
interface User {
    loginType?: any; // Define the correct type for loginType

}


export default function ResetPassword({ activeKey }: Props) {

    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);


    const userLogin = user?.loginType;

    const onFinish = async (values: any) => {

        try {
            setLoading(true);
            const res = await updatePassword(user?._id, values);
            if (res.status == true) {
                message.success(res.message);
                form.resetFields();
            }
        } catch (error) {

            ErrorHandler.showNotification(error);
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = async (_: any, value: any) => {
        const currentPassword = form.getFieldValue('currentPassword');
        if (value && currentPassword && value === currentPassword) {
            throw new Error('New password should be different from the current password.');
        }
    };
    return (
        <>
            <div className="smallTopMargin"></div>
            <Form layout='vertical' form={form} size='large' onFinish={onFinish}>
                <Row>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Row gutter={10}>
                            <Col xl={24} md={24} sm={24} xs={24} className="MarginBottomXMobile">
                                {userLogin ? null : <Form.Item
                                    name="currentPassword"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter current Password!'
                                        }
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Enter current password"
                                        maxLength={20}
                                    />
                                </Form.Item>}
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name="newPassword"
                                    rules={[
                                        { required: true, message: 'Please input your Password!' },
                                        {
                                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                            message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
                                        },
                                        { validator: validatePassword },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Enter new password"
                                        maxLength={20}
                                    />
                                </Form.Item>

                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['newPassword']}
                                    rules={[
                                        { required: true, message: 'Please confirm your Password!' },


                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('newPassword') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The two passwords do not match!'));
                                            }
                                        })
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Enter confirm Password"
                                        maxLength={20}
                                    />
                                </Form.Item>
                            </Col>
                            <Col md={24} style={{ textAlign: 'end' }}>
                                <Button type='primary' htmlType='submit' style={{ borderRadius: '30px' }}>Submit</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
