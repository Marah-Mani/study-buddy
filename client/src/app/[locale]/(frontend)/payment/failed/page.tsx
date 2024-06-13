'use client';
import React, { useEffect } from 'react';
import { Result, Button } from 'antd';
import { HomeOutlined, ExclamationCircleOutlined, CreditCardOutlined } from '@ant-design/icons'; // Added ExclamationCircleOutlined
import { useRouter } from 'next/navigation';

export default function FailedPage() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push('/');
		}, 2000);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div style={{ maxWidth: '300px', margin: 'auto', paddingTop: '300px' }}>
			<Result
				icon={<ExclamationCircleOutlined style={{ fontSize: '48px', color: '#f5222d' }} />} // Changed icon to ExclamationCircleOutlined
				title="Payment Failed"
				subTitle="Your payment was not successful."
				extra={
					<Button type="primary" onClick={() => router.push('/')}>
						Go Home
					</Button>
				}
			/>
		</div>
	);
}
