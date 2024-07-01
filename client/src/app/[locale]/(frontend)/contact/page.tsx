'use client';
import React, { } from 'react';
import { Col, Row, Image } from 'antd';;
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
import './style.css';
export default function Page() {
    return (
        <div>
            <section className='contactUsSection'>
                <div className='customContainer'>
                    <Row gutter={[16, 16]} align='middle'>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <div className="contact-text">
                                <Titles level={3} color='primaryColor'>Have questions or feedback?</Titles>
                                <div className='gapMarginTopTwo'></div>
                                <ParaText size='small' color='primaryColor' fontWeightBold={600} className='dBlock'>
                                    We re here to support your StudyBuddy experience!
                                </ParaText>
                                <div className='gapMarginTopTwo'></div>
                                <div className="info">
                                    <div className="information">
                                        <ParaText size='small' fontWeightBold={600} color='primaryColor' className='dBlock'>study24buddyy@gmail.com</ParaText>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textCenter'>
                            <div className="contact-info">
                                <Image src="/images/imgpsh_fullsize_anim (6) 1.png" alt="" preview={false} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    )
}
