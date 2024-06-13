'use client'
import React, { useState } from 'react';
import './style.css'
import type { MenuProps } from 'antd';
import { Button, Col, Input, Image, Row, Space, Divider } from 'antd';
import DropDownOne from './DropDownOne';
import DropDownTwo from './DropDownTwo';
import { CiSearch } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import ParaText from '@/app/commonUl/ParaText';
import DropDownThree from './DropDownThree';
import { CiLocationOn } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { FaRocketchat } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa6";
import {
    FacebookOutlined,
    LinkedinOutlined,
    TwitterOutlined,
    YoutubeOutlined,
} from '@ant-design/icons';
import { Flex, Tag } from 'antd';
export default function Page() {
    const [current, setCurrent] = useState('mail');
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return (
        <>
            <div className='gapMarginTop'></div>
            <div style={{ padding: '15px' }}>
                <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                    <div className='gapMarginTop'></div>
                    <div className='menuStyle'>
                        <Row gutter={[16, 16]} align='middle'>
                            <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                                <ParaText size='extraSmall'> <strong>1287</strong> Candidates match your job search</ParaText>
                            </Col>
                            <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
                                <div className='floatRight'>
                                    <Space wrap>
                                        <Input placeholder='Enter Your Keyword' style={{ border: '0px', width: '100%' }} />
                                        <DropDownOne />
                                        <DropDownThree />
                                        <DropDownTwo />
                                        <Button icon={<CiSearch />} type='primary'></Button>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <br />
                    <div style={{
                        padding: ' 15px 15px 25px 15px'
                    }} className='candidates-details'>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <Row>
                                    <Col xs={24} sm={24} md={3} lg={3} xl={3} xxl={3} className=''>
                                        <Image src='https://nextjs.spruko.com/ynex-js/preview/assets/images/faces/1.jpg' width={50} height={50} alt='user' style={{ borderRadius: '50px' }} />
                                    </Col>
                                    <Col xs={24} sm={24} md={21} lg={21} xl={21} xxl={21}>
                                        <ParaText size="medium" className="dBlock" fontWeightBold={600}>
                                            Brenda Simpson
                                        </ParaText>
                                        <ParaText size="textGraf" fontWeightBold={600}>
                                            Software Developer
                                        </ParaText>
                                        &nbsp;
                                        <ParaText size="textGraf">
                                            <CiLocationOn />
                                            Kondapur, Hyderabad
                                        </ParaText>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                <div>
                                    <span><FaRocketchat size={16} /></span> &nbsp;<span><CiHeart size={16} /></span>
                                </div>
                                <br />
                                <div>
                                    <span><FaFacebookSquare size={20} /></span> &nbsp;<span><FaInstagramSquare size={20} /></span> &nbsp;<span><FaTwitter size={20} /></span>&nbsp;<span><IoLogoYoutube size={20} /></span>
                                </div>
                            </Col>
                        </Row>
                        <br />
                        <Flex gap="4px 0" wrap='wrap'>
                            <Tag icon={<FaUserGraduate />} >
                                &nbsp;
                                Graduate
                            </Tag>
                            <Tag icon={<YoutubeOutlined />}>
                                flexible-shift
                            </Tag>
                            <Tag icon={<FacebookOutlined />}>
                                Immediate Joinee
                            </Tag>
                            <Tag icon={<LinkedinOutlined />} >
                                Good at English
                            </Tag>
                        </Flex>
                        <br />
                        <Row gutter={[16, 16]} align='middle'>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <ParaText size="textGraf" fontWeightBold={600} className='dBlock'>
                                    <ParaText size="textGraf">
                                        In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.
                                    </ParaText>
                                </ParaText>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                <ParaText size="textGraf" fontWeightBold={600} className='dBlock'>
                                    <ParaText size="textGraf">
                                        <span>
                                            <strong> Languages :</strong> </span>
                                        &nbsp;
                                        <span>English, Hindi, Telugu</span>
                                    </ParaText>
                                </ParaText>
                            </Col>
                        </Row>
                        <Divider />
                        <Row gutter={[16, 16]} align='middle'>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                <Flex gap="4px 0" wrap='wrap'>
                                    <ParaText size="textGraf">
                                        <span>
                                            <strong> Skills :</strong>   &nbsp;</span>

                                    </ParaText>
                                    <Tag >
                                        React
                                    </Tag>
                                    <Tag >
                                        React Native
                                    </Tag>
                                    <Tag >
                                        More
                                    </Tag>

                                </Flex>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                                <div className='floatRight'>
                                    <Flex gap="4px 0" wrap='wrap'>
                                        <Tag icon={<TwitterOutlined />} color='cyan' >
                                            2 year bond accepted

                                        </Tag>
                                        <Tag icon={<YoutubeOutlined />} color='success'>
                                            Exp : 4 Years
                                        </Tag>
                                    </Flex>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </div >
        </>
    )
}

