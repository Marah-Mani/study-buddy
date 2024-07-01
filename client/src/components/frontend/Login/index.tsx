'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, message, Col, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import { signIn, signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { socialLogin } from '@/lib/ApiAdapter';
import { useRouter } from 'next/navigation';
import ErrorHandler from '@/lib/ErrorHandler';
import { FcGoogle } from "react-icons/fc";
import { ImFacebook2 } from "react-icons/im";
import ParaText from '@/app/commonUl/ParaText';
import './style.css'
import Titles from '@/app/commonUl/Titles';

const Login = () => {
	const [form] = Form.useForm();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { login, setUser } = useContext(AuthContext);
	const { data: session } = useSession();

	const validateEmail = (rule: any, value: any, callback: any) => {
		const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
		if (gmailPattern.test(value)) {
			callback(); // Valid Gmail address
		} else {
			callback(''); // Invalid Gmail address
		}
	};

	const onFinish = async (values: any) => {
		setLoading(true);
		try {
			await login(values.email, values.password, '');
		} catch (error) {
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (session) {
			SocialData(session.user);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const SocialData = (user: any) => {
		const data = {
			name: user.name,
			email: user.email
		};
		socialLogin(data)
			.then((res: any) => {
				if (res) {
					Cookies.set('session_token', res.token);
					setUser(res.user);
					signOut({ redirect: false }).then();
					router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/user/dashboard`);
				} else {
					message.error(res.message);
				}
			})
			.catch((err) => {
				ErrorHandler.showNotification(err);
			});
	};

	const handleGoogleLogin = async () => {
		try {
			await signIn('google');
		} catch (error) {
			console.error('Google login failed:', error);
		}
	};

	const handleFacebookLogin = async () => {
		try {
			await signIn('facebook');
		} catch (error) {
			console.error('Facebook login failed:', error);
		}
	};

	return (

		<>
			<div className='loginMain'>
				<div className='login'>
					<div className='heading'>
						<Titles level={5} color='primaryColor' className='textCenter overEfact paddingBottomTwo'>Login</Titles>
					</div>
					<Form
						name="normal_login"
						className="login-form"
						initialValues={{ remember: true }}
						onFinish={onFinish}
						form={form}
						style={{ paddingTop: '20px' }}
					>
						<Form.Item name="email" rules={[
							{
								required: true, message: 'Please input your Email!'
							},
							{
								type: 'email',
								message: 'The input is not a valid email!',
							}, { validator: validateEmail }
						]}>
							<Input
								prefix={<UserOutlined className="site-form-item-icon" />} style={{ height: "40px" }} type={'email'} placeholder="Email" maxLength={30} />
						</Form.Item>
						<Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
							<Input.Password
								prefix={<LockOutlined className="site-form-item-icon" />}
								type="password"
								placeholder="Password"
								style={{ height: "40px" }}
								maxLength={15}
							/>
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%', height: '40px' }}>
								{loading ? 'Please wait...' : 'Log in'}
							</Button>

						</Form.Item>
						<Col lg={12} md={12} sm={12} xs={24}>
							<Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
								<Checkbox>Remember me</Checkbox>
							</Form.Item>
						</Col>
						<Form.Item>
							<div style={{ textAlign: 'center', marginBottom: '20px' }}>Or</div>

							<div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px', gap: '10px' }}>
								<Button
									// type="primary"
									style={{ display: 'flex', width: '50%', height: "40px", alignItems: "center", justifyContent: 'center' }}
									icon={<FcGoogle style={{ display: 'flex', alignItems: "center", justifyContent: 'center' }} />}
									onClick={handleGoogleLogin}
								>
									Google
								</Button>
								<Button
									// type="primary"
									style={{ display: 'flex', width: '50%', height: "40px", alignItems: "center", justifyContent: 'center' }}
									icon={<ImFacebook2 style={{ display: 'flex', alignItems: "center", justifyContent: 'center' }} />}
									onClick={handleFacebookLogin}
								>
									Facebook
								</Button>
							</div>
						</Form.Item>
					</Form>
					<div style={{ textAlign: 'center', marginTop: '20px' }}>
						<span>
							Not registered?{' '}
							<Link href="/en/register" passHref>
								<ParaText color="primaryColor" size="textGraf" fontWeightBold={700}> Register here</ParaText></Link>
						</span>
					</div>
					<div style={{ textAlign: 'center', marginTop: '20px' }}>
						<span>
							Forgot Password?{' '}
							<Link href="/en/forgot-password" passHref>
								<ParaText color="primaryColor" size="textGraf" fontWeightBold={700}> Click here</ParaText>
							</Link>
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
