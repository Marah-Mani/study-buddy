import React from 'react'
import './style.css'
import { FaRocketchat } from "react-icons/fa6";
import { SiGooglemarketingplatform } from "react-icons/si";
import { MdForum } from "react-icons/md";
import { Col, Row } from 'antd';
import Titles from '@/app/commonUl/Titles';
import { FaFileDownload } from "react-icons/fa";
import { SiThealgorithms } from "react-icons/si";
export default function Features() {
    return (
        <>
            <div className='features'>
                <div className="customContainer">
                    <div className='textCenter'>
                        <Titles level={3} color='black'>Our Features</Titles>
                    </div>
                    <br />
                    <br />
                    <Row justify='center'>
                        <Col xl={16}>
                            <div className="main-timeline">
                                <div className="timeline">
                                    <div className="timeline-content">
                                        <div className="timeline-icon"><FaRocketchat /></div>
                                        <h3 className="title">Chat Area</h3>
                                        <p className="description">
                                            Connect with fellow students in real-time. Join study groups, discuss assignments, and share insights through our integrated chat system.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline">
                                    <div className="timeline-content">
                                        <div className="timeline-icon"><SiGooglemarketingplatform /></div>
                                        <h3 className="title">Marketplace</h3>
                                        <p className="description">
                                            Buy, sell, or trade textbooks, gadgets, and other college essentials within your community.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline">
                                    <div className="timeline-content">
                                        <div className="timeline-icon"><MdForum /></div>
                                        <h3 className="title"> Q&A Forum</h3>
                                        <p className="description">
                                            Get answers to your academic questions from peers and experts. Share your knowledge to help others.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline">
                                    <div className="timeline-content">
                                        <div className="timeline-icon"><FaFileDownload /></div>
                                        <h3 className="title"> File Management</h3>
                                        <p className="description">
                                            Share and access study materials like exams, summaries, and notes based on your courses.
                                        </p>
                                    </div>
                                </div>
                                <div className="timeline">
                                    <div className="timeline-content">
                                        <div className="timeline-icon"><SiThealgorithms /></div>
                                        <h3 className="title">Matching Algorithm</h3>
                                        <p className="description">
                                            Pair with tutors or study partners based on your major and courses. Indicate if you need help or want to help others, and get matched according to your selection.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

