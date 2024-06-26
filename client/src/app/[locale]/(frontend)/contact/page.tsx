'use client';
import React, { } from 'react';
import { Col, Row } from 'antd';;
import { SiFacebook } from "react-icons/si";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import './style.css'
import { PiInstagramLogoFill } from "react-icons/pi";
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
import { IoMdMail } from "react-icons/io";
export default function Page() {
    return (
        <div>
            <section className='contactUsSection'>
                <div className=''>
                    <div className="container">
                        <span className="big-circle" />
                        <div className='customContainer'>
                            <div className="form">
                                <Row gutter={[16, 16]} justify='center'>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                        <div className="contact-info">
                                            <Titles level={3} color='black'>Have questions or feedback</Titles>
                                            <div className='gapMarginTopTwo'></div>
                                            <ParaText size='extraSmall' color='black' className='dBlock'>
                                                We re here to support your StudyBuddy experience!
                                            </ParaText>
                                            <div className='gapMarginTopTwo'></div>

                                            <div className="info">
                                                <div className="information">
                                                    <IoMdMail /> &nbsp;&nbsp;
                                                    <p>study24buddyy@gmail.com</p>
                                                </div>
                                            </div>
                                            <div className="info">
                                                <div className="information">
                                                    <FaPhoneAlt /> &nbsp;&nbsp;
                                                    <p>123-456-789</p>
                                                </div>
                                            </div>
                                            <div className="social-media">
                                                <p>Connect with social media :</p>
                                                <div className="social-icons">
                                                    <a href="#">
                                                        <SiFacebook />
                                                    </a>
                                                    <a href="#">
                                                        <FaTwitter />
                                                    </a>
                                                    <a href="#">
                                                        <PiInstagramLogoFill />
                                                    </a>
                                                    <a href="#">
                                                        <FaYoutube />
                                                    </a>
                                                </div>
                                            </div>

                                        </div>

                                    </Col>
                                </Row>
                                <span className="circle one" />
                                <span className="circle two" />
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    )
}
