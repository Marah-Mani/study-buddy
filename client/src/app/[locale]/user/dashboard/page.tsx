'use client';
import React, { useContext, useEffect, useState } from 'react';
import './style.css'
import AuthContext from '@/contexts/AuthContext';
import { Col, Row, Card, Timeline, Typography } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import { getUserActivities } from '@/lib/commonApi';
import DateFormat from '@/app/commonUl/DateFormat';
import { getDashboardData } from '@/lib/userApi';
import Link from 'next/link';

const { Title } = Typography;

export default function Dashboard() {
	const { user } = useContext(AuthContext);
	const [activities, setActivities] = useState<any>([]);
	const [dashboardData, setDashboardData] = useState<any>(null);

	useEffect(() => {
		if (user?._id) fetchActivities()
		if (user?._id) fetchData();
	}, [user])

	const fetchData = async () => {
		try {
			const res = await getDashboardData(user?._id);
			if (res.status == true) {
				setDashboardData(res.data);
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
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={24} md={8} lg={6} xl={6} xxl={6}>
						<div className="gapMarginTopTwo"></div>
						<Card
							extra={
								<Link
									href={`${process.env['NEXT_PUBLIC_SITE_URL']}/user/market-place`}
									style={{ color: 'rgb(134 93 224) ' }}
								>
									View all
								</Link>}
							title={<Title level={5}>My Market Place</Title>}
							className='timelineCard'
							style={{ borderTop: '2px solid rgb(132 90 223)', cursor: 'pointer', boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)' }}
						>
							<Timeline
								items={dashboardData?.myProducts?.map((product: any) => ({
									children: product.title,
									color: getRandomColor(),
								}))}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={8} lg={6} xl={6} xxl={6}>
						<div className="gapMarginTopTwo"></div>
						<Card
							extra={
								<Link
									href={`${process.env['NEXT_PUBLIC_SITE_URL']}/user/forums`}
									style={{ color: 'rgb(134 93 224) ' }}
								>
									View all
								</Link>}
							title={<Title level={5}>My Forums</Title>}
							className='timelineCard'
							style={{ borderTop: '2px solid rgb(230 83 60)', cursor: 'pointer', boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)' }}
						>
							<Timeline
								items={dashboardData?.myForums?.map((forum: any) => ({
									children: (
										<Link
											href={`${process.env.NEXT_PUBLIC_SITE_URL}/admin/questions/${forum.slug}`}
										>{forum.title}</Link>),
									color: getRandomColor(),
								}))}
							/>
						</Card>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
						<div className="gapMarginTopTwo"></div>
						<Card
							title={<Title level={5}>Timeline</Title>}
							className='timelineCard'
							style={{ borderTop: '2px solid  rgb(38 191 148)', cursor: 'pointer', boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)' }}
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
