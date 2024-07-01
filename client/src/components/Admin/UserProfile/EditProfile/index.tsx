import ParaText from '@/app/commonUl/ParaText'
import { Col, Form, Image, Row, Tabs } from 'antd'
import React from 'react'
import { FaPhone } from 'react-icons/fa';
import { IoMailOutline } from 'react-icons/io5';
import EditProfile from '../../Profile/EditProfile';
import About from '../About';
import Activity from '../Activity';
import Documents from '../Documents';
import PaymentHistory from '../PaymentHistory';

export default function index() {
    const items = new Array(5).fill(null).map((_, i) => {
        const id = String(i + 1);
        let label = '';
        switch (i) {
            case 0:
                label = 'About';
                break;
            case 1:
                label = 'Activity';
                break;
            case 2:
                label = 'Documents';
                break;
            case 3:
                label = 'Edit Profile';
                break;
            case 4:
                label = 'Payment History';
                break;
            default:
                break;
        }

        return {
            label: label,
            key: id,
            type: 'left',
            tabPosition: 'left',
            children: (
                <>
                    {i === 0 && <About />}
                    {i === 1 && <Activity />}
                    {i === 2 && <Documents />}
                    {i === 3 && <EditProfile activeKey={'3'} />}
                    {i === 4 && <PaymentHistory />}
                </>
            )
        };
    });
    return (
        <>
            <div className="smallTopMargin"></div>
            <Form layout='vertical' size='large' >
                <Row>
                    <Col xl={22} lg={22} md={22} sm={24} xs={24}>
                        <Row gutter={[14, 14]}>
                            <Col md={3} lg={3} xl={3} sm={24} xs={24}>
                                <Image
                                    width='100%'
                                    preview={false}
                                    src='/images/avatar.png'
                                    style={{ borderRadius: '5px' }}
                                />
                            </Col>
                            <Col md={20} lg={20} xl={20} sm={24} xs={24}>
                                <ParaText size="small" fontWeightBold={500} color="primaryColor">
                                    User Name
                                </ParaText>
                                <br />
                                <span>location</span>
                                <div className="smallTopMargin"></div>
                                <span><FaPhone style={{ fontSize: '12px' }} /> Phone : +91 98745-63211</span><br />
                                <span><IoMailOutline style={{ fontSize: '12px' }} /> Email : example@gmail.com</span><br />
                                <span>Website : https://abc.com</span>
                            </Col>
                            <Col md={24} lg={24} xl={24} sm={24} xs={24}>
                                <div className="largeTopMargin"></div>
                                <Tabs defaultActiveKey="1" items={items} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
