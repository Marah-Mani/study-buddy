'use client';
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa6";
import { forgetEmailPassword } from '@/lib/ApiAdapter';
import { useRouter } from 'next/navigation';
import ErrorHandler from '@/lib/ErrorHandler';
import './style.css'
import Titles from '@/app/commonUl/Titles';
const ForgotPassword = () => {
	const [form] = Form.useForm();
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const resetPassword = async (values: any) => {
		try {
			setLoading(true);
			const res = await forgetEmailPassword({ email: values.email });

			if (res) {
				message.success('Email send successfully please check your email');
				form.resetFields();
				router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/login`);
			}
		} catch (error) {
			setLoading(false);
			ErrorHandler.showNotification(error);
		}
	};

	return (
		<div className='forgetPassword'>
			<div className='heading'>
				<Titles level={5} color='primaryColor' className='textCenter overEfact paddingBottomTwo'>Forgot Password</Titles>
			</div>
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{ remember: true }}
				onFinish={resetPassword}
				form={form}
				style={{ paddingTop: '20px' }}
			>
				<Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]} >
					<Input style={{ height: '40px' }} prefix={<UserOutlined className="site-form-item-icon" />} type={'email'} placeholder="Email" maxLength={30} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%', height: '40px' }}>
						{loading ? 'Please wait...' : 'Send me the link'}
					</Button>
				</Form.Item>
				<Link href="/en/login" passHref style={{ color: '#f1a638 !important' }}>
					<Button type="link" style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<FaArrowLeft style={{ display: 'flex', alignItems: 'center' }} />}>
						Back to login
					</Button>
				</Link>
			</Form>
		</div>
	);
};

export default ForgotPassword;
