import React from 'react'
import { Col, Image, Row } from 'antd';
import { Carousel } from 'antd';
import './style.css'
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
export default function FaqSection() {
    return (
        <>
            <div className='faqSection'>
                <div className="customContainer">
                    <div className='faqSection-main'>
                        <Row>
                            <Col xs={24} sm={24} md={12} lg={12} xl={6} xxl={6}>
                                <div className='mainHeading'> <Titles level={3} color='black'>Why Choose Study Buddy?</Titles></div>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={9} xl={9} xxl={9}>
                                <div className='faqSection-text'>
                                    <Image src='/images/imgpsh_fullsize_anim (3).png' alt='' width={60} height={60} preview={false} />
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={5} color='secondaryColor'>Community connection</Titles>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <ParaText size='medium' color='black'>Connect with fellow students in real-time. Join study groups, discuss assignments, and share insights through our integrated chat system.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Image src='/images/imgpsh_fullsize_anim.png' alt='' width={60} height={60} preview={false} />
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={5} color='secondaryColor'>Personalized Matches</Titles>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <ParaText size='medium' color='black'>Buy, sell, or trade textbooks, gadgets, and other college essentials within your community.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={9} xl={9} xxl={9}>
                                <div className='faqSection-text'>
                                    <Image src='/images/imgpsh_fullsize_anim (2).png' alt='' width={60} height={60} preview={false} />
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={5} color='secondaryColor'>Steamlined Learning</Titles>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <ParaText size='medium' color='black'>Connect with fellow students in real-time. Join study groups, discuss assignments, and share insights through our integrated chat system.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Image src='/images/imgpsh_fullsize_anim (1).png' alt='' width={60} height={60} preview={false} />
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={5} color='secondaryColor'> Security First</Titles>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <ParaText size='medium' color='black'>Get answers to your academic questions from peers and experts. Share your knowledge to help others</ParaText>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    )
}

