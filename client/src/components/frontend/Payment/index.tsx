'use client';
import React, { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AuthContext from '@/contexts/AuthContext';

const stripePromise = loadStripe('pk_test_FQu4ActGupRmMrkmBpwU26js');

const Payment = () => {
	const [loading, setLoading] = useState(false);
	const [currency, setCurrency] = useState('');
	const { user } = useContext(AuthContext);

	useEffect(() => {
		fetch(
			'http://ip-api.com/json?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,query'
		)
			.then((response) => response.json())
			.then((data) => {
				setCurrency(data.currency.toLowerCase());
				// console.log(data);
			})
			.catch((error) => {
				console.error('Error fetching user IP:', error);
			});
	}, []);

	const handlePayment = async (values: any) => {
		try {
			setLoading(true);
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-checkout-session`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					price: parseInt(values.price),
					userId: user?._id,
					currency,
					userEmail: user?.email
				})
			});

			const session = await response.json();

			const stripe = await stripePromise;
			const result = await stripe?.redirectToCheckout({
				sessionId: session.id
			});

			if (result?.error) {
				console.error('Error:', result.error);
				message.error('Payment failed');
			}
		} catch (error) {
			console.error('Error:', error);
			message.error('Payment failed');
		} finally {
			setLoading(false);
		}
	};

	const handleCurrencyChange = (value: any) => {
		setCurrency(value);
	};

	return (
		<div style={{ maxWidth: '300px', margin: 'auto', paddingTop: '300px' }}>
			<h1 style={{ textAlign: 'center' }}>Payment</h1>
			<Elements stripe={stripePromise}>
				<Form
					name="payment_form"
					initialValues={{ remember: true }}
					onFinish={handlePayment}
					style={{ paddingTop: '20px' }}
				>
					<Form.Item name="price" rules={[{ required: true, message: 'Please input a random number!' }]}>
						<Input prefix={<UserOutlined />} placeholder="Enter Random Number" style={{ borderRadius: '30px' }} />
					</Form.Item>
					<Form.Item
						name="currency"
						rules={[{ required: true, message: 'Please select a currency!' }]}
						initialValue="inr"
					>
						<Select placeholder="Select Currency" onChange={handleCurrencyChange} style={{ borderRadius: '30px' }}>
							<Select.Option value="usd">USD</Select.Option>
							<Select.Option value="eur">EUR</Select.Option>
							<Select.Option value="gbp">GBP</Select.Option>
							<Select.Option value="aed">AED</Select.Option>
							<Select.Option value="inr">INR</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%', borderRadius: '30px' }}>
							Pay with Stripe
						</Button>
					</Form.Item>
				</Form>
			</Elements>
		</div>
	);
};

export default Payment;
