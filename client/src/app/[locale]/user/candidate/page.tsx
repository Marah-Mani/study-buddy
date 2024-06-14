'use client'
import React, { useContext, useEffect, useState } from 'react';
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
import { getAllCandidate } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import { IoLogoLinkedin } from 'react-icons/io5';


export default function Page() {
    const [current, setCurrent] = useState('mail');
    const [AllCandidates, setAllCandidates] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) fetchAllCandidates();
    }, [user]);

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const fetchAllCandidates = async () => {
        try {
            const response = await getAllCandidate();
            setAllCandidates(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    const capitalizeFirstLetterOfEachWord = (text: string) => {
        if (!text) return text;
        return text.replace(/\b\w/g, char => char.toUpperCase());
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
                                        {/* <DropDownOne /> */}
                                        <DropDownThree />
                                        <DropDownTwo />
                                        <Button icon={<CiSearch />} type='primary'></Button>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <br />
                    {AllCandidates.map((item: any) => (
                        <>
                            <div style={{ padding: ' 15px 15px 25px 15px' }} className='candidates-details'>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                        <Row>
                                            <Col xs={24} sm={24} md={3} lg={3} xl={3} xxl={3} className=''>
                                                <Image src={
                                                    item?.image
                                                        ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${item?.image}`
                                                        : `/images/avatar.png`
                                                } width={50} height={50} alt='user' style={{ borderRadius: '50px' }} />
                                            </Col>
                                            <Col xs={24} sm={24} md={21} lg={21} xl={21} xxl={21}>
                                                <Flex align='center'>
                                                    <ParaText size="medium" className="dBlock" fontWeightBold={600}>
                                                        {`${item?.name} `}
                                                    </ParaText>
                                                    <Tag color='success' style={{ marginLeft: '8px' }}>
                                                        {capitalizeFirstLetterOfEachWord(item?.interestedIn)}
                                                    </Tag>
                                                    {/* <ParaText size="small" className="" fontWeightBold={400}>
                                                        <span style={{ marginLeft: '8px' }}>
                                                            {' ('}{item?.interestedIn}{')'}
                                                        </span>
                                                    </ParaText> */}
                                                </Flex>
                                                <ParaText size="textGraf" fontWeightBold={600}>
                                                    {item?.profileTitle && capitalizeFirstLetterOfEachWord(item?.profileTitle)}
                                                </ParaText>
                                                &nbsp;
                                                {/* <ParaText size="textGraf">
                                                    <CiLocationOn />
                                                    Kondapur, Hyderabad
                                                </ParaText> */}
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                        <div>
                                            <span><FaRocketchat size={20} /></span> &nbsp;<span><CiHeart size={20} /></span>
                                        </div>
                                        <br />
                                        <div>
                                            {item.socialLinks.facebook !== "null" && item.socialLinks.facebook !== null &&
                                                <a href={item.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                                    <span><FaFacebookSquare size={20} /></span>
                                                </a>
                                            }
                                            {item.socialLinks.instagram !== "null" && item.socialLinks.instagram !== null &&
                                                <a href={item.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                                    <span><FaInstagramSquare size={20} /></span>
                                                </a>
                                            }
                                            {item.socialLinks.twitter !== "null" && item.socialLinks.twitter !== null &&
                                                <a href={item.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                                    <span><FaTwitter size={20} /></span>
                                                </a>
                                            }
                                            {item.socialLinks.likedIn !== "null" && item.socialLinks.linkedin !== null &&
                                                <a href={item.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                                    <span><IoLogoLinkedin size={20} /></span>
                                                </a>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                                <br />
                                <Flex gap="4px 0" wrap='wrap'>
                                    <Tag icon={<FaUserGraduate />} >
                                        &nbsp;
                                        {item?.higherEducation && capitalizeFirstLetterOfEachWord(item?.higherEducation)}
                                    </Tag>
                                    {/* <Tag icon={<YoutubeOutlined />}>
                                        flexible-shift
                                    </Tag>
                                    <Tag icon={<FacebookOutlined />}>
                                        Immediate Joinee
                                    </Tag>
                                    <Tag icon={<LinkedinOutlined />} >
                                        Good at English
                                    </Tag> */}
                                </Flex>
                                <br />
                                <Row gutter={[16, 16]} align='middle'>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                        <ParaText size="textGraf">
                                            <span>
                                                <strong> Department :</strong> </span>
                                            &nbsp;
                                            <span>
                                                {item?.departmentId?.departmentName}
                                            </span>
                                        </ParaText>
                                        <br />
                                        <ParaText size="textGraf">
                                            <span>
                                                <strong> Subjects :</strong> </span>
                                            &nbsp;
                                            <span>
                                                {item.departmentId.subjects.length > 0 ?
                                                    item.departmentId.subjects.map((subject: string, index: number) => (
                                                        <React.Fragment key={index}>
                                                            {index > 0 && ', '}
                                                            {subject}
                                                        </React.Fragment>
                                                    ))
                                                    : 'N/A'
                                                }
                                            </span>
                                        </ParaText>
                                        <br />
                                        <ParaText size="textGraf" fontWeightBold={600} className='dBlock'>
                                            <ParaText size="textGraf" fontWeightBold={600}>
                                                {item?.profileDescription}

                                                {/* In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. */}
                                            </ParaText>
                                        </ParaText>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                        <ParaText size="textGraf" fontWeightBold={600} className='dBlock'>
                                            <ParaText size="textGraf">
                                                <span>
                                                    <strong> Languages :</strong> </span>
                                                &nbsp;
                                                <span>
                                                    {item.languages.length > 0 ?
                                                        item.languages.map((language: string, index: number) => (
                                                            <React.Fragment key={index}>
                                                                {index > 0 && ', '}
                                                                {capitalizeFirstLetterOfEachWord(language)}
                                                            </React.Fragment>
                                                        ))
                                                        : 'N/A'
                                                    }
                                                </span>
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
                                            {item.skills.map((skill: string, index: number) => (
                                                <Tag key={index}>
                                                    {capitalizeFirstLetterOfEachWord(skill)}
                                                </Tag>
                                            ))}
                                            {item.skills.length === 0 && (
                                                <Tag>
                                                    No skills specified
                                                </Tag>
                                            )}

                                        </Flex>
                                    </Col>
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                                        {/* <div className='floatRight'>
                                            <Flex gap="4px 0" wrap='wrap'>
                                                <Tag icon={<TwitterOutlined />} color='cyan' >
                                                    2 year bond accepted

                                                </Tag>
                                                <Tag icon={<YoutubeOutlined />} color='success'>
                                                    Exp : 4 Years
                                                </Tag>
                                            </Flex>
                                        </div> */}
                                    </Col>
                                </Row>
                            </div>
                        </>
                    ))}

                </Col>
            </div >
        </>
    )
}

