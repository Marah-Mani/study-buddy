'use client';
import React, { useContext, useEffect, useState } from 'react';
import './style.css'
import AuthContext from '@/contexts/AuthContext';
import { Col, Row, Card, Timeline, Typography, Modal, Tooltip, Image } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import { getDashboardData } from '@/lib/adminApi';
import ParaText from '@/app/commonUl/ParaText';
import { UserOutlined } from '@ant-design/icons';
import { IoDocumentText } from 'react-icons/io5';
import ShortFileName from '@/app/commonUl/ShortFileName';
import { useRouter } from 'next/navigation';
import InfoModal from '@/components/MarketPlace/InfoModal';

const { Title } = Typography;

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [infoModal, setInfoModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    useEffect(() => {
        if (user) fetchData();
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

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const router = useRouter();

    const handleDetail = (data: any) => {
        setInfoModal(true);
        setSelectedProduct(data);
    }

    return (
        <>
            <div className='dashBody'>
                <div className="gapMarginTopTwo"></div>
                <Row gutter={[20, 20]}>
                    <Col md={24}>
                        <div className="gapMarginTopTwo"></div>
                        <Row gutter={[20, 20]}>
                            <Col xs={12} sm={12} md={12} lg={8} xl={4} xxl={4} className='userCard'>
                                <Card
                                    style={{
                                        borderTop: '2px solid rgb(132 90 223)',
                                        cursor: 'pointer',
                                        boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={() => router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/users`)}
                                >
                                    <div className="textCenter">
                                        <div className="userTotal">
                                            <UserOutlined style={{ color: '#fff', fontSize: '18px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">Total Students</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalStudentCount}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={8} xl={4} xxl={4} className='studentCard'>
                                <Card
                                    style={{
                                        borderTop: '2px solid rgb(35 183 229)',
                                        cursor: 'pointer',
                                        boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={() => router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/users`)}
                                >
                                    <div className="textCenter">
                                        <div className="studentTotal userTotal">
                                            <UserOutlined style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">Total Tutors</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalTutorCount}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={8} xl={4} xxl={4} className='totalCard'>
                                <Card
                                    style={{
                                        borderTop: '2px solid rgb(38 191 148)',
                                        cursor: 'pointer',
                                        boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={() => router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/users`)}
                                >
                                    <div className="textCenter">
                                        <div className="totalCount userTotal">
                                            <UserOutlined style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">Total Users</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalUsers}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={8} xl={4} xxl={4} className='totalProduct'>
                                <Card
                                    style={{
                                        borderTop: '2px solid rgb(245 184 73)',
                                        cursor: 'pointer',
                                        boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={() => router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/market-place`)}
                                >
                                    <div className="textCenter">
                                        <div className="productTotal userTotal">
                                            <IoDocumentText style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">Total Products</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalProduct}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={8} xl={4} xxl={4} className='totalForum'>
                                <Card
                                    style={{
                                        borderTop: '2px solid rgb(230 83 60)',
                                        cursor: 'pointer',
                                        boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)'
                                    }}
                                    onClick={() => router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/forums`)}
                                >
                                    <div className="textCenter">
                                        <div className="forumTotal userTotal">
                                            <IoDocumentText style={{ color: '#fff', fontSize: '25px' }} />
                                        </div>
                                        <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">Total Forums</ParaText><br />
                                        <Title level={4} color='black' className='textCenter'>{dashboardData?.totalForums}</Title>
                                    </div>
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={8} xl={4} xxl={4} className='totalForum'>

                            </Col>
                            <Col xs={24} sm={24} md={8} lg={7} xl={7} xxl={7} className='timelineCard'>
                                <div className="gapMarginTopTwo"></div>
                                <Card
                                    style={{ borderTop: '2px solid rgba(190, 74, 99, 0.85)', cursor: 'pointer', boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)' }}
                                    title={<Title level={4}>Latest Forums</Title>}
                                >
                                    <Timeline
                                        items={dashboardData?.latestForums?.map((forum: any) => ({
                                            children: (
                                                <ShortFileName
                                                    onClick={() => { router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/admin/questions/${forum.slug}`) }}
                                                    fileName={forum.title}
                                                    short={50}
                                                />
                                            ),
                                            color: getRandomColor(),
                                        }))}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={24} md={8} lg={7} xl={7} xxl={7} className='timelineCard'>
                                <div className="gapMarginTopTwo"></div>
                                <Card
                                    style={{ borderTop: '2px solid rgb(38 191 148)', cursor: 'pointer', boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)' }}
                                    title={<Title level={4}>Latest Products</Title>}
                                >
                                    <Timeline
                                        items={dashboardData?.latestProducts?.map((forum: any) => ({
                                            children: (
                                                <ShortFileName
                                                    fileName={forum.title}
                                                    short={50}
                                                    onClick={() => handleDetail(forum)} />),
                                            color: getRandomColor(),
                                        }))}
                                    />
                                </Card>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={7} xl={5} xxl={5} className='timelineCard'>
                                <div className="gapMarginTopTwo"></div>
                                <Card
                                    style={{ borderTop: '2px solid rgb(132 90 223)', cursor: 'pointer', boxShadow: ' 0 4px 8px rgba(0, 0, 0, 0.1)' }}
                                    title={<Title level={4}>Newly Registered Users</Title>}
                                >
                                    <Timeline
                                        items={dashboardData?.latestUsers?.map((forum: any) => ({
                                            children: (
                                                <Tooltip
                                                    title={(
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <div>
                                                                <Image
                                                                    src={forum?.image ?
                                                                        `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${forum?.image}`
                                                                        : `/images/avatar.png`}
                                                                    alt={forum.name}
                                                                    width={60}
                                                                    height={60}
                                                                    style={{ borderRadius: '5px' }} />
                                                            </div>
                                                            <div>
                                                                <p>{forum.name}</p>
                                                                <p>{forum.email}</p>
                                                                <p>{forum.phoneNumber}</p>
                                                            </div>
                                                            <div>{' '}</div>
                                                        </div>
                                                    )}
                                                    style={{ width: '500px', height: '200px' }}
                                                >
                                                    <p
                                                        onClick={() => router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/users`)}>
                                                        {forum.name}
                                                    </p>
                                                </Tooltip>
                                            ),
                                            color: getRandomColor(),
                                        }))}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div >
            <Modal
                title={"Item details"}
                open={infoModal}
                onCancel={() => setInfoModal(false)}
                footer={null}
                width={890}
            >
                <InfoModal
                    product={selectedProduct}
                />
            </Modal>
        </>
    );
}
