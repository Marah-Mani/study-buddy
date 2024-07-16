'use client';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './style.css'
import React, { useState } from 'react';
import { createNewPassword } from '@/lib/ApiAdapter';
import { useRouter, useSearchParams } from 'next/navigation';
import ErrorHandler from '@/lib/ErrorHandler';
import Link from 'next/link';
import Titles from '@/app/commonUl/Titles';
export default function ResetPassword() {
	const [form] = Form.useForm();
	const searchParams = useSearchParams();
	const userID = searchParams.get('userId');
	const token = searchParams.get('token');
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const newPassword = async (values: any) => {
		try {
			setLoading(true);
			const updatedValues = { ...values, userId: userID, token: token };
			const res = await createNewPassword(updatedValues);
			if (res) {
				setLoading(false);
				message.success('New password has been set successfully');
				router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/login`);
			}
		} catch (error) {
			setLoading(false);
			ErrorHandler.showNotification(error);
		}
	};

	return (
		<>
			<div className='resetpasssword'>
				<div className='heading'>
					<Titles level={5} color='primaryColor' className='textCenter overEfact paddingBottomTwo'>Set New Password</Titles>
				</div>
				<Form
					name="normal_login"
					className="login-form"
					initialValues={{ remember: true }}
					onFinish={newPassword}
					form={form}
					style={{ paddingTop: '20px' }}
				>
					<Form.Item name="password" rules={[
						{
							required: true, message: 'Please input your Password!'
						},
						{
							pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^~`#])[A-Za-z\d@$!%*?&^~`#]{8,}$/,
							message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
						}
					]}>
						<Input.Password
							prefix={<LockOutlined className="site-form-item-icon" />}
							type="password"
							placeholder="Enter new password"
							minLength={8}
							style={{ height: '40px', borderRadius: '30px' }}
							maxLength={15} />
					</Form.Item>
					<Form.Item
						name="confirmPassword"
						dependencies={['password']}
						rules={[
							{ required: true, message: 'Please confirm your Password!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
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
							style={{ height: '40px', borderRadius: '30px' }}
							placeholder="Enter confirm Password"
							maxLength={20} />
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							className="register-form-button"
							style={{ width: '100%', height: '40px', borderRadius: '30px' }}
						>
							{loading ? 'Please wait...' : 'Reset Password'}
						</Button>
					</Form.Item>
					<Link href="/en/login" passHref>
						<Button type="primary" style={{ width: '100%', height: '40px', borderRadius: '30px' }}>
							Back To Login
						</Button>
					</Link>
				</Form>
			</div>
		</>
	);
}
