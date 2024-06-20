'use client';
import React, { useContext, useEffect, useState } from 'react';
import './style.css'
import AuthContext from '@/contexts/AuthContext';
import { Col, Row, Card, Timeline, Typography } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import { getUserActivities } from '@/lib/commonApi';
import DateFormat from '@/app/commonUl/DateFormat';
import { getDashboardData } from '@/lib/adminApi';

const { Title } = Typography;

export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [activities, setActivities] = useState<any>([]);

	useEffect(() => {
		if (user?._id) fetchActivities()
		fetchData();
	}, [user])

	const fetchData = async () => {
		try {
			const res = await getDashboardData();
			if (res.status == true) {

			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	const fetchActivities = async () => {
		try {
			const response = await getUserActivities(user?._id);
			if (response.status == true) {
				setActivities(response.data);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}
	const getRandomColor = () => {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	return (
		<>
			<div className='dashBody'>
				<div className="gapMarginTopTwo"></div>
				<Row>
					<Col md={12}>
						<div className="gapMarginTopTwo"></div>
						<Row>
							<Col md={8}>
							</Col>
							<Col md={8}>
							</Col>
							<Col md={8}>
							</Col>
						</Row>
					</Col>
					<Col md={7}>
						<div className="gapMarginTopTwo"></div>
						<Card
							title={<Title level={4}>Timeline</Title>}
							className='timelineCard'
						>
							<Timeline
								mode="left"
								items={activities.map((activity: any) => ({
									label: (<DateFormat date={activity.timestamp} />),
									children: activity.activityMessage,
									color: getRandomColor(),
								}))}
							/>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
}
