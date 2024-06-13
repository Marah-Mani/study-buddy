'use client';
import React, { useEffect, useState } from 'react';
import ParaText from '../ParaText';
import Titles from '../Titles';
import styles from './dashboardCard.module.css';
import { FaStar } from 'react-icons/fa6';
import { Col, Row } from 'antd';
import SkeletonLoader from '../SkeletonLoader';

interface DataProps {
	title: string | null;
	count: any;
	text: string | null;
}

export default function DashboardCard({ title, count, text }: DataProps) {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 100); // Simulating a 2-second loading time. You can adjust this as needed.

		return () => clearTimeout(timer);
	}, []);
	return (
		<>
			<div>
				{loading ? (
					<div>
						<SkeletonLoader height="100px" />
					</div>
				) : (
					<div className={styles['dashCardUpdate']}>
						<Row align="middle" gutter={16}>
							<Col lg={12} md={12} sm={12} xs={12}>
								<Titles level={4} color="white" className="weight700">
									<b>{count}</b>
								</Titles>
							</Col>
							<Col lg={12} md={12} sm={12} xs={12} className="textEnd">
								<ParaText size="medium" color="white" className="weight500">
									{title}
								</ParaText>
								<br />
								<ParaText size="textGraf" color="white">
									<b>{text}</b>
								</ParaText>
							</Col>
						</Row>
					</div>
				)}
			</div>
		</>
	);
}
