'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import { signIn, signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { forgetEmailPassword, socialLogin } from '@/lib/ApiAdapter';
import { useRouter } from 'next/navigation';
import ErrorHandler from '@/lib/ErrorHandler';

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
		<div style={{ maxWidth: '300px', margin: 'auto', paddingTop: '300px' }}>
			<h1 style={{ textAlign: 'center' }}>Forgot Password</h1>
			<Form
				name="normal_login"
				className="login-form"
				initialValues={{ remember: true }}
				onFinish={resetPassword}
				form={form}
				style={{ paddingTop: '20px' }}
			>
				<Form.Item name="email" rules={[{ required: true, message: 'Please input your Email!' }]} >
					<Input prefix={<UserOutlined className="site-form-item-icon" />} type={'email'} placeholder="Email" maxLength={30} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
						{loading ? 'Please wait...' : 'Send me the link'}
					</Button>
				</Form.Item>
				<Link href="/en/login" passHref>
					<Button type="primary" style={{ width: '100%' }}>
						Back to login
					</Button>
				</Link>
			</Form>
		</div>
	);
};

export default ForgotPassword;
