'use client';
import React, { useContext, useEffect, useState } from 'react';
import './style.css'
import AuthContext from '@/contexts/AuthContext';
import { Col, Row, Card, Timeline, Typography } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import { getUserActivities } from '@/lib/commonApi';
import DateFormat from '@/app/commonUl/DateFormat';
import { getDashboardData } from '@/lib/adminApi';
import ParaText from '@/app/commonUl/ParaText';
import { UserOutlined } from '@ant-design/icons';
import { IoDocumentText } from 'react-icons/io5';

const { Title } = Typography;

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState<any>([]);
    const [dashboardData, setDashboardData] = useState<any>(null);

    useEffect(() => {
        if (user?._id) fetchActivities()
        fetchData();
    }, [user])

    const fetchData = async () => {
        try {
            const res = await getDashboardData();
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
                <div className="gapMarginTopTwo"></div>
                <Row gutter={[20, 20]}>
                    <Col md={12}>
                        <div className="gapMarginTopTwo"></div>
                        <Row gutter={[20, 20]}>
                            <Col md={8} className='userCard'>
                                <Card>
                                    <div className="textCenter">
                                        <div className="userTotal">
                                            <UserOutlined style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">Total Students</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalStudentCount}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={8} className='studentCard'>
                                <Card>
                                    <div className="textCenter">
                                        <div className="studentTotal">
                                            <UserOutlined style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">Total Tutors</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalTutorCount}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={8} className='totalCard'>
                                <Card>
                                    <div className="textCenter">
                                        <div className="totalCount">
                                            <UserOutlined style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">Total Users</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalUsers}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={12} className='totalProduct'>
                                <Card>
                                    <div className="textCenter">
                                        <div className="productTotal">
                                            <IoDocumentText style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">Total Products</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalProduct}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col md={12} className='totalForum'>
                                <Card>
                                    <div className="textCenter">
                                        <div className="forumTotal">
                                            <IoDocumentText style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="PrimaryColor">Total Forums</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalForums}</Title>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={7} className='timelineCard'>
                        <div className="gapMarginTopTwo"></div>
                        <Card
                            title={<Title level={4}>Timeline</Title>}
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
