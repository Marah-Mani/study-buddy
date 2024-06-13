'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Button, message, Modal, Select } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getDepartments, register, sendEmailVerification } from '@/lib/ApiAdapter';
import { signIn, signOut, useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { socialLogin } from '@/lib/ApiAdapter';
import ErrorHandler from '@/lib/ErrorHandler';
import VerificationModal from '@/app/commonUl/VerificationModal';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { FcGoogle } from "react-icons/fc";
import { ImFacebook2 } from "react-icons/im";
import ParaText from '@/app/commonUl/ParaText';

const Register = () => {
	const [form] = Form.useForm();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const { login, setUser } = useContext(AuthContext);
	const { data: session } = useSession();
	const [verificationModal, setVerificationModal] = useState(false);
	const [userEmail, setEmail] = useState('');
	const [formData, setFormData] = useState<any>();
	const [departments, setDepartments] = useState<any>([]);
	const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null);

	const validateEmail = (rule: any, value: any, callback: any) => {
		const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
		const yahooPattern = /^[a-zA-Z0-9._%+-]+@yahoo\.com$/;

		if (gmailPattern.test(value) || yahooPattern.test(value)) {
			callback(); // Valid Gmail or Yahoo address
		} else {
			callback(''); // Invalid email address
		}
	};

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			setEmail(values.email);
			setFormData(values);
			await sendEmailVerification(values).then((res) => {
				setLoading(false);
				setVerificationModal(true);
			});
		} catch (error) {
			setLoading(false);
			setVerificationModal(false);
			ErrorHandler.showNotification(error);
		}
	};

	useEffect(() => {

		getDepartments().then((res) => {
			if (res.status === true) {
				setDepartments(res.data);
			}
		});

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


	const handleResendOtp = () => {
		onFinish(formData);
	};

	const handleOtp = async (otp: any) => {
		try {
			message.success('OTP matched successfully');
			setVerificationModal(false);
			await handleRegister();
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleSkip = async () => {
		setVerificationModal(false)
		await handleRegister();
	};

	const handleRegister = async () => {
		try {
			setLoading(true);
			const res = await register(formData);
			if (res.status === true) {
				message.success(res.message);
				form.resetFields();
				router.push('/en/user/dashboard');
			} else {
				message.error(res.message);
			}
		} catch (error) {
			message.error('Failed to register. Please try again later.');
		} finally {
			setLoading(false);
		}
	};
	const handleDepartmentChange = (value: string) => {
		setSelectedDepartment(value);
		form.setFieldsValue({ subjects: [] }); // Reset subjects field in the form
	};

	const getSubjectsForDepartment = (departmentName: string): string[] => {
		const selectedDept = departments.find((dept: any) => dept._id === departmentName); // Assuming _id is used as the unique identifier
		return selectedDept ? selectedDept.subjects : [];
	};

	return (
		<>
			<div style={{ maxWidth: '300px', margin: 'auto', paddingTop: '100px' }}>
				<h1 style={{ textAlign: 'center' }}>Register</h1>
				<Form
					name="normal_register"
					className="register-form"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					form={form}
					style={{ paddingTop: '20px' }}
				>
					<Form.Item name="name" rules={[
						{
							required: true,
							message: 'Please input your Full Name!',
						},
						{
							pattern: /^[A-Za-z\s]+$/,
							message: 'Please enter only alphabets!',
						},

					]}>
						<Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Full Name" maxLength={30} />
					</Form.Item>
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
							prefix={<UserOutlined className="site-form-item-icon" />} type={'email'} placeholder="Email" maxLength={30} />
					</Form.Item>

					<Form.Item
						name="interest"
						rules={[{ required: true, message: 'Please select your interest!' }]}
					>
						<Select placeholder="Select interest">
							<Select.Option value="tutor">Tutor</Select.Option>
							<Select.Option value="student">Student</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						name="departments"
						rules={[{ required: true, message: 'Please select departments!' }]}
					>
						<Select placeholder="Select departments" onChange={handleDepartmentChange} >
							{departments && departments.map((department: any) => (
								<Select.Option key={department._id} value={department._id}>
									{department.departmentName}
								</Select.Option>
							))}
						</Select>
					</Form.Item>

					<Form.Item
						name="subjects"
						rules={[{ required: true, message: 'Please select subjects!' }]}
					>
						<Select mode="multiple" placeholder="Select subjects" maxTagCount="responsive" disabled={!selectedDepartment}>
							{selectedDepartment &&
								getSubjectsForDepartment(selectedDepartment).map((subject: string, index: number) => (
									<Select.Option key={index} value={subject}>
										{subject}
									</Select.Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item name="password" rules={[
						{
							required: true,
							// message: 'Please input your Password!'
						},
						{
							pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^~`#])[A-Za-z\d@$!%*?&^~`#]{8,}$/,
							message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
						}
					]}>
						<Input.Password
							prefix={<LockOutlined className="site-form-item-icon" />}
							type='password'
							placeholder="Enter password"
							maxLength={20} />
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
							type='password'
							iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
							visibilityToggle
							placeholder="Enter confirm Password"
							maxLength={20} />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" className="register-form-button" style={{ width: '100%' }}>
							{loading ? 'Please wait...' : 'Register'}
						</Button>
					</Form.Item>
					<Form.Item>
						<div style={{ textAlign: 'center' }}>Or</div>
						<div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
							<Button
								// type="primary"
								style={{ width: '45%', height: "44px", alignItems: "center", }}
								icon={<FcGoogle />}
								onClick={handleGoogleLogin}
							>
								Google
							</Button>
							<Button
								// type="primary"
								style={{ width: '45%', height: "44px", alignItems: "center" }}
								icon={<ImFacebook2 style={{ color: '#4064ac' }} />}
								onClick={handleFacebookLogin}
							>
								Facebook
							</Button>
						</div>
					</Form.Item>
				</Form>
				<div style={{ textAlign: 'center', marginTop: '20px' }}>
					<span className='loginHere'>
						Already registered?{' '}
						<Link href="/en/login" passHref>
							<ParaText color="PrimaryColor" size="textGraf" fontWeightBold={600}>Log in here</ParaText>
						</Link>
					</span>
				</div>
			</div>
			<Modal
				width={550}
				open={verificationModal}
				footer={false}
				onCancel={() => {
					setVerificationModal(false), setLoading(false);
				}}
			>
				<VerificationModal
					userEmail={userEmail}
					onClose={(otp: any) => handleOtp(otp)}
					onResend={handleResendOtp}
					onCancel={() => {
						setVerificationModal(false), setLoading(false);
					}}
					onSkip={handleSkip}
				/>
			</Modal>
		</>
	);
};

export default Register;
