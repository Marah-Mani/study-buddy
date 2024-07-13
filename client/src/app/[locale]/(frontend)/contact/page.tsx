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
                <div className="waves">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#f1a638" fill-opacity="1" d="M0,96L30,112C60,128,120,160,180,160C240,160,300,128,360,122.7C420,117,480,139,540,149.3C600,160,660,160,720,149.3C780,139,840,117,900,112C960,107,1020,117,1080,144C1140,171,1200,213,1260,202.7C1320,192,1380,128,1410,96L1440,64L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
                    </svg>
                </div>
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
                                <img src="/images/imgpsh_fullsize_anim (6) 1.png" alt="" />
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>
        </div>
    )
}
