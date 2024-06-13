'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, message, Space, Avatar, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import { getUserById } from '@/lib/ApiAdapter';
import { useRouter, useSearchParams } from 'next/navigation';
import ParaText from '@/app/commonUl/ParaText';

const LockScreen = () => {
	const [form] = Form.useForm();
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [userData, setUserData] = useState<any>();
	const { login, setUser } = useContext(AuthContext);

	const onFinish = async (values: any) => {
		setLoading(true);
		try {
			await login(userData?.email, values.password, '');
		} catch (error) {
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		async function fetchData() {
			const userId = searchParams.get('userId');
			if (userId) {
				try {
					const response = await getUserById(userId);
					setUserData(response.data);
				} catch (error) {
					console.error('Error fetching user details:', error);
				}
			}
		}

		fetchData();
	}, [searchParams]);

	return (
		<div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '300px' }}>
			<Card style={{ width: 400, backgroundColor: 'white', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' }}>
				<h1 style={{ textAlign: 'center' }}>Lock Screen</h1>
				<p style={{ textAlign: 'center', fontWeight: '300' }}>Hello {userData?.name}</p>
				<Form
					name="normal_login"
					className="login-form"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					form={form}
					style={{ paddingTop: '20px' }}
				>
					<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
						<Space>
							{userData?.image ? (
								<Avatar size={44} src={userData?.image} />
							) : (
								<Avatar size={44} icon={<UserOutlined />} />
							)}
						</Space>
						<ParaText size="small" fontWeightBold={400} color="black">
							{userData?.email}
						</ParaText>
					</div>
					<div className="gapMarginTopOne"></div>
					<Form.Item
						name="password"
						label="Password"
						rules={[{ required: true, message: 'Please input your Password!' }, {
							// pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^~`#])[A-Za-z\d@$!%*?&^~`#]{8,}$/,
							// message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
						}]}
						labelCol={{ span: 24 }}
						wrapperCol={{ span: 24 }}
					>
						<Input.Password
							prefix={<LockOutlined className="site-form-item-icon" />}
							type="password"
							placeholder="Password"
							maxLength={20}
						/>
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
							{loading ? 'Please wait...' : 'Unlock'}
						</Button>
					</Form.Item>
				</Form>
				<div style={{ textAlign: 'center', marginTop: '20px' }}>
					<span>
						Not You?{' '}
						<Link href="/en/login">
							Login here
						</Link>
					</span>
				</div>
			</Card>
		</div>
	);
};

export default LockScreen;
