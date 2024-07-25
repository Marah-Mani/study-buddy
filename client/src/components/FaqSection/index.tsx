import React from 'react'
import { Col, Row } from 'antd';
import Image from 'next/image';
import './style.css'
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
export default function FaqSection() {
    return (
        <>
            <div className='faqSection'>
                <video autoPlay muted loop id='backgroundVideo'>
                    <source src="/images/85590-590014592.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className='overlay'></div>
                <div className="customContainer">
                    <div className='faqSection-main'>
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={8} xl={6} xxl={6}>
                                <div className='mainHeading'> <Titles level={2} color='black'>Why Choose <br /> StudyBuddy?</Titles></div>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={8} xl={9} xxl={9}>
                                <div className='faqSection-text add-padding-new'>
                                    <Image src='/images/imgpsh_fullsize_anim (3).png' alt='' width={60} height={60} />
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={5} color='secondaryColor'>Community connection</Titles>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <ParaText size='medium' color='black'>Join a supportive community of peers who share your academic journey and goals.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Image src='/images/imgpsh_fullsize_anim.png' alt='' width={60} height={60} />
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={5} color='secondaryColor'> Security First</Titles>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <ParaText size='medium' color='black'>Your data privacy is our priority. StudyBuddy ensures a safe and secure learning environment.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                </div>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={8} xl={9} xxl={9}>
                                <div className='faqSection-text'>
                                    <Image src='/images/imgpsh_fullsize_anim (2).png' alt='StudyBuddy Banner' width={60} height={60} />
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={5} color='secondaryColor'>Personalized Matches</Titles>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <ParaText size='medium' color='black'>Our smart algorithm pairs you with the perfect study partner or tutor based on your needs.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Image src='/images/imgpsh_fullsize_anim (1).png' alt='' width={60} height={60} />
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={5} color='secondaryColor'>Steamlined Learning</Titles>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <ParaText size='medium' color='black'>Access all your study needs in one place—chat, Q&A, marketplace, and file management.</ParaText>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    )
}

