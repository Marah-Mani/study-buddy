'use client'
import React, { useContext, useEffect, useState } from 'react';
import './style.css'
import { notification, Tooltip } from 'antd';
import { Button, Col, Input, Image, Row, Space, Divider, Dropdown, Menu, message, Skeleton } from 'antd';
import { CiSearch } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import ParaText from '@/app/commonUl/ParaText';
import { CiHeart } from "react-icons/ci";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaUserGraduate } from "react-icons/fa6";
import { Flex, Tag } from 'antd';
import { getAllCandidate, getAllDepartments } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IoLogoLinkedin } from 'react-icons/io5';
import { WechatOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function Page() {
    const [AllCandidates, setAllCandidates] = useState<any[]>([]);
    const [AllDepartments, setAllDepartments] = useState([]);
    const [AllSubjects, setAllSubjects] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
    });
    const token = Cookies.get('session_token')
    const { chats, setChats }: any = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAllCandidates();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, selectedDepartment, searchQuery, selectedSubject, pagination.page]);

    useEffect(() => {
        if (user) {
            fetchAllDepartments();
        }
    }, [user]);

    const fetchAllCandidates = async () => {
        const query = {
            interestedIn: user?.interestedIn,
            department: selectedDepartment?._id,
            searchQuery: searchQuery,
            subject: selectedSubject,
            page: pagination.page,
            pageSize: pagination.pageSize,
        };

        try {
            setLoading(true);
            const response = await getAllCandidate(query);

            if (pagination.page == 1) {
                // Reset candidates list when fetching the first page
                setAllCandidates(response.data);
                setLoading(false);
            } else {
                // Append new data to existing candidates list for pagination
                setAllCandidates(prevCandidates => [...prevCandidates, ...response.data]);
                message.success(`${response.data.length} more candidates loaded successfully!`);
                setLoading(false);
            }

            // Update pagination total count
            setPagination(prev => ({
                ...prev,
                total: response.totalCount,
            }));
        } catch (error) {
            setLoading(false);
            console.error('Error fetching candidates:', error);
        }
    };

    const fetchAllDepartments = async () => {
        try {
            const response = await getAllDepartments();
            setAllDepartments(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    const handleDepartmentChange = (e: any) => {
        setSelectedSubject("");
        setAllSubjects([]);
        const selected: any = AllDepartments.find((item: any) => item._id === e.key);
        setSelectedDepartment(selected);
        if (selected) setAllSubjects(selected?.subjects);
        setPagination(prev => ({
            ...prev,
            page: 1, // Reset page number when department changes
        }));

        fetchAllCandidates();
    };

    const handleSubjectsChange = (e: any) => {
        const selectedKey = e.key;
        setSelectedSubject(selectedKey === "all" ? "" : selectedKey);
        setPagination(prev => ({
            ...prev,
            page: 1, // Reset page number when subjects change
        }));
        fetchAllCandidates();
    };

    const handleInputChange = (e: any) => {
        setSearchQuery(e.target.value);
        setPagination(prev => ({
            ...prev,
            page: 1, // Reset page number when search query changes
        }));
    };


    const capitalizeFirstLetterOfEachWord = (text: string) => {
        if (!text) return text;
        return text.replace(/\b\w/g, char => char.toUpperCase());
    };
    const router = useRouter();

    const accessChat = async (userId: any) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/common/chat`, { userId }, config);

            if (!chats.find((c: any) => c._id === data._id)) setChats([data, ...chats]);
            router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${user?.role}/chat?${data._id}`);
        } catch (error) {
            notification.error({
                message: "Error fetching the chat"
            });
        }
    };

    return (
        <>
            <div className='sectionPart'>
                <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                    <div className='menuStyle'>
                        <Row gutter={[16, 16]} align='middle'>
                            <Col xs={24} sm={24} md={4} lg={4} xl={6} xxl={8}>
                                <ParaText size='small' color='primaryColor' fontWeightBold={600}> <strong>{AllCandidates.length}</strong>{user?.interestedIn === "student" ? " Tutor" : " student"}</ParaText>
                            </Col>
                            <Col xs={24} sm={24} md={20} lg={20} xl={18} xxl={16}>
                                <div className='floatRight'>
                                    <Space wrap>
                                        <Dropdown overlay={
                                            <Menu onClick={handleDepartmentChange}>
                                                <Menu.Item key="all">All</Menu.Item>
                                                {AllDepartments && AllDepartments.map((item: any) => (
                                                    <Menu.Item key={item._id}>
                                                        {capitalizeFirstLetterOfEachWord(item?.departmentName)}
                                                    </Menu.Item>
                                                ))}
                                            </Menu>
                                        }>
                                            <Button style={{ width: '250px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {selectedDepartment ? capitalizeFirstLetterOfEachWord(selectedDepartment.departmentName) : 'Select Department'}
                                                </span>
                                                <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                                            </Button>
                                        </Dropdown>
                                        <Dropdown overlay={
                                            <Menu onClick={handleSubjectsChange}>
                                                <Menu.Item key="all">All</Menu.Item>
                                                {AllSubjects.map(subject => (
                                                    <Menu.Item key={subject}>
                                                        {subject}
                                                    </Menu.Item>
                                                ))}

                                            </Menu>
                                        }>
                                            <Button style={{ width: '250px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '0px' }}>
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {selectedSubject ? capitalizeFirstLetterOfEachWord(selectedSubject) : 'Select subject'}
                                                </span>
                                                <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                                            </Button>
                                        </Dropdown>
                                        <Input.Search
                                            placeholder="Search with name"
                                            style={{ width: '100%', borderRadius: '0px' }}
                                            value={searchQuery}
                                            onChange={handleInputChange}
                                            enterButton={
                                                <Button icon={<CiSearch />} style={{ borderRadius: '0px' }} type='primary'></Button>
                                            }
                                        />
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <br />
                    <InfiniteScroll
                        dataLength={AllCandidates.length}
                        next={() => setPagination(prev => ({ ...prev, page: pagination.page + 1 }))}
                        hasMore={AllCandidates.length < pagination.total}
                        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                        endMessage={!loading && <Divider plain>It is all, nothing more 🤐</Divider>}
                    >
                        {AllCandidates.map((item: any) => (
                            <>
                                <div style={{ padding: ' 15px 15px 25px 15px' }} className='candidates-details'>

                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={8}>
                                            <Row align='middle'>
                                                <Col xs={6} sm={3} md={6} lg={4} xl={4} xxl={3} className=''>
                                                    <Image src={
                                                        item?.image
                                                            ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${item?.image}`
                                                            : `/images/avatar.png`
                                                    } width={50} height={50} alt='user' style={{ borderRadius: '50px' }} />
                                                </Col>
                                                <Col xs={18} sm={21} md={18} lg={20} xl={20} xxl={21}>
                                                    <Flex align='center'>
                                                        <ParaText size="small" color='primaryColor' className="dBlock" fontWeightBold={600}>
                                                            {`${item?.name} `}
                                                        </ParaText>
                                                        <Tag color='success' style={{ marginLeft: '8px' }}>
                                                            {capitalizeFirstLetterOfEachWord(item?.interestedIn)}
                                                        </Tag>
                                                    </Flex>

                                                    <ParaText size="textGraf" fontWeightBold={600} color='black'>
                                                        {item?.profileTitle && capitalizeFirstLetterOfEachWord(item?.profileTitle)}
                                                    </ParaText>
                                                    &nbsp;
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                                            <ParaText size="textGraf" color='primaryColor'>
                                                <span>
                                                    <strong> Department :</strong> </span>
                                                &nbsp;
                                                <span>
                                                    {item?.departmentId?.departmentName}
                                                </span>
                                            </ParaText>
                                            &nbsp; &nbsp; &nbsp;
                                            <ParaText size="textGraf" color='primaryColor'>
                                                <span>
                                                    <strong> Subjects :</strong> </span>
                                                &nbsp;
                                                <span>
                                                    {item.subjects.length > 0 ?
                                                        item.subjects.map((subject: string, index: number) => (
                                                            <React.Fragment key={index}>
                                                                {index > 0 && ', '}
                                                                {subject}
                                                            </React.Fragment>
                                                        ))
                                                        : 'N/A'
                                                    }
                                                </span>
                                            </ParaText>
                                            <br className='dNone' />
                                            <br className='dNone' />
                                            <Flex gap="4px 0" wrap='wrap'>
                                                <Tag icon={<FaUserGraduate />} >
                                                    &nbsp;
                                                    {item?.higherEducation && capitalizeFirstLetterOfEachWord(item?.higherEducation)}
                                                </Tag>
                                                <ParaText size="textGraf" color='black'>
                                                    <span>
                                                        <strong> Skills :</strong>   &nbsp;</span>

                                                </ParaText>
                                                &nbsp;
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
                                        <Col className='textEnd' xs={24} sm={24} md={4} lg={4} xl={4} xxl={4}>
                                            <Tooltip
                                                title={<span style={{ color: 'black', fontWeight: 600 }}>Chat now</span>}
                                                color={'#EDF1F5'}
                                            >
                                                <WechatOutlined onClick={() => accessChat(item?._id)} style={{ fontSize: '30px', cursor: 'pointer', color: '#f1a638' }} />
                                            </Tooltip> &nbsp;
                                            <span><CiHeart size={30} /></span>
                                            <div>
                                                <br />
                                                <br className='dNone' />
                                                <Space size={[8, 16]} wrap>
                                                    {item.socialLinks.facebook !== "null" && item.socialLinks.facebook !== null &&
                                                        <a href={item.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                                                            <span><FaFacebookSquare size={20} color='#838383' /></span>
                                                        </a>
                                                    }
                                                    {item.socialLinks.instagram !== "null" && item.socialLinks.instagram !== null &&
                                                        <a href={item.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                                            <span><FaInstagramSquare color='#838383' size={20} /></span>
                                                        </a>
                                                    }
                                                    {item.socialLinks.twitter !== "null" && item.socialLinks.twitter !== null &&
                                                        <a href={item.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                                            <span><FaTwitter size={20} color='#838383' /></span>
                                                        </a>
                                                    }
                                                    {item.socialLinks.likedIn !== "null" && item.socialLinks.linkedin !== null &&
                                                        <a href={item.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                                            <span><IoLogoLinkedin size={20} color='#838383' /></span>
                                                        </a>
                                                    }
                                                </Space>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Divider />
                                    <Row gutter={[16, 16]} align='middle'>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                            <ParaText size="textGraf" color='black'>
                                                {item?.profileDescription}
                                            </ParaText>
                                        </Col>
                                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                            <ParaText size="textGraf" fontWeightBold={600} className='dBlock'>
                                                <ParaText size="textGraf" color='black'>
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

                                </div>
                            </>
                        ))}
                        {loading && <Skeleton avatar paragraph={{ rows: 1 }} active />}
                    </InfiniteScroll>

                </Col>
            </div >
        </>
    )
}

