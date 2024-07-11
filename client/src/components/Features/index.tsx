import React from 'react'
import { Col, Row } from 'antd';
import Image from 'next/image';
import './style.css'
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
export default function Features() {
    return (
        <>
            <div className='features'>
                <div className="customContainer">
                    <Titles level={2} color='secondaryColor'>Features</Titles>
                    <div className='features-main'>
                        <Row>
                            <Col xl={6}>
                                <div className='features-text'>
                                    <Titles level={4} color='secondaryColor'>Chat Area</Titles>
                                    <ParaText size='medium' color='black'>Connect with fellow students in real-time. Join study groups, discuss assignments, and share insights through our integrated chat system.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={4} color='secondaryColor'>Marketplace</Titles>
                                    <ParaText size='medium' color='black'>Buy, sell, or trade textbooks, gadgets, and other college essentials within your community.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={4} color='secondaryColor'> Q&A Forum</Titles>
                                    <ParaText size='medium' color='black'>Get answers to your academic questions from peers and experts. Share your knowledge to help others</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                </div>

                            </Col>
                            <Col xl={12}>
                                <div className='features-text textCenter '>
                                    <Image src='/images/imgpsh_fullsize_anim (4) 1 (1).png' layout='responsive' alt='Study Buddy Banner' width={500} height={300} />
                                </div>
                            </Col>
                            <Col xl={6}>
                                <div className='features-text'>
                                    <Titles level={4} color='secondaryColor'>File Management</Titles>
                                    <ParaText size='medium' color='black'>Share and access study materials like exams, summaries, and notes based on your courses.</ParaText>
                                    <div className='gapPaddingTopOTwo'></div>
                                    <Titles level={4} color='secondaryColor'>Matching Algorithm</Titles>
                                    <ParaText size='medium' color='black'>Pair with tutors or study partners based on your major and courses. Indicate if you need help or want to help others, and get matched ac</ParaText>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    )
}

