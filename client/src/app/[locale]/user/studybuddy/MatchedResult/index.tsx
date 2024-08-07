'use client';
import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import { Button, notification, Result, Tooltip } from 'antd';
import { Col, Input, Image, Row, Space, Divider, message, Skeleton } from 'antd';
import { CiSearch } from 'react-icons/ci';
import { FaXTwitter } from "react-icons/fa6";
import ParaText from '@/app/commonUl/ParaText';
import { FaFacebookSquare } from 'react-icons/fa';
import { FaInstagramSquare } from 'react-icons/fa';
import { Flex } from 'antd';
import { getAllCandidate, getAllDepartments } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IoLogoLinkedin } from 'react-icons/io5';
import Cookies from 'js-cookie';
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
    GetLanguages, //async functions
} from "react-country-state-city";
import Loading from '@/app/commonUl/Loading';

interface Props {
    type: string;
}

export default function MatchedResult({ type }: Props) {
    const [AllCandidates, setAllCandidates] = useState<any[]>([]);
    const [AllDepartments, setAllDepartments] = useState([]);
    const [AllSubjects, setAllSubjects] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
    const [selectedSubject, setSelectedSubject] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0
    });
    const token = Cookies.get('session_token');
    const { chats, setChats }: any = useContext(ChatContext);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [languageList, setLanguageList] = useState<any[]>([]);

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
        GetLanguages().then((result: any) => {
            setLanguageList(result);
        });
    }, [user]);

    const fetchAllCandidates = async () => {
        setLoading(true);

        const query = {
            userId: user?._id,
            interestedIn: type,
            department: selectedDepartment?._id,
            searchQuery: searchQuery,
            subject: selectedSubject,
            page: pagination.page,
            pageSize: pagination.pageSize
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
                setAllCandidates((prevCandidates) => [...prevCandidates, ...response.data]);
                message.success(`${response.data.length} more candidates loaded successfully!`);
                setLoading(false);
            }

            // Update pagination total count
            setPagination((prev) => ({
                ...prev,
                total: response.totalCount
            }));
            setLoading(false);

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
        setSelectedSubject('');
        setAllSubjects([]);
        const selected: any = AllDepartments.find((item: any) => item._id === e.key);
        setSelectedDepartment(selected);
        if (selected) setAllSubjects(selected?.subjects);
        setPagination((prev) => ({
            ...prev,
            page: 1 // Reset page number when department changes
        }));

        fetchAllCandidates();
    };

    const handleSubjectsChange = (e: any) => {
        const selectedKey = e.key;
        setSelectedSubject(selectedKey === 'all' ? '' : selectedKey);
        setPagination((prev) => ({
            ...prev,
            page: 1 // Reset page number when subjects change
        }));
        fetchAllCandidates();
    };

    const handleInputChange = (e: any) => {
        setSearchQuery(e.target.value);
        setPagination((prev) => ({
            ...prev,
            page: 1 // Reset page number when search query changes
        }));
    };

    const capitalizeFirstLetterOfEachWord = (text: string) => {
        if (!text) return text;
        return text.replace(/\b\w/g, (char) => char.toUpperCase());
    };
    const router = useRouter();

    const accessChat = async (userId: any) => {
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/common/chat`, { userId }, config);

            if (!chats.find((c: any) => c._id === data._id)) setChats([data, ...chats]);
            router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${user?.role}/chat?${data._id}`);
        } catch (error) {
            notification.error({
                message: 'Error fetching the chat'
            });
        }
    };

    return (
        <>
            {loading ? <Loading /> :
                <div className="sectionPart">
                    <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                        <div className="menuStyle">
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} sm={24} md={4} lg={4} xl={6} xxl={8}>
                                </Col>
                                <Col xs={24} sm={24} md={20} lg={20} xl={18} xxl={16}>
                                    <div className="floatRight">
                                        {AllCandidates.length > 0 &&
                                            <Space wrap>
                                                {/* <Dropdown
                                            overlay={
                                                <div style={{ border: '2px solid #f1a638', borderRadius: '8px' }}>
                                                    <Menu onClick={handleDepartmentChange}>
                                                        <Menu.Item key="all" className="hovercolor">
                                                            All
                                                        </Menu.Item>
                                                        {AllDepartments &&
                                                            AllDepartments.map((item: any) => (
                                                                <Menu.Item key={item._id} className="hovercolor">
                                                                    {capitalizeFirstLetterOfEachWord(
                                                                        item?.departmentName
                                                                    )}
                                                                </Menu.Item>
                                                            ))}
                                                    </Menu>
                                                </div>
                                            }
                                        >
                                            <Button
                                                style={{
                                                    width: '250px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {selectedDepartment
                                                        ? capitalizeFirstLetterOfEachWord(
                                                            selectedDepartment.departmentName
                                                        )
                                                        : 'Select Department'}
                                                </span>
                                                <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                                            </Button>
                                        </Dropdown>
                                        <Dropdown
                                            overlay={
                                                <div style={{ border: '2px solid #f1a638', borderRadius: '8px' }}>
                                                    <Menu onClick={handleSubjectsChange}>
                                                        <Menu.Item key="all" className="hovercolor">
                                                            All
                                                        </Menu.Item>
                                                        {AllSubjects.map((subject) => (
                                                            <Menu.Item key={subject} className="hovercolor">
                                                                {subject}
                                                            </Menu.Item>
                                                        ))}
                                                    </Menu>
                                                </div>
                                            }
                                        >
                                            <Button
                                                style={{
                                                    width: '250px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    borderRadius: '30px 30px 30px 30px'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {selectedSubject
                                                        ? capitalizeFirstLetterOfEachWord(selectedSubject)
                                                        : 'Select subject'}
                                                </span>
                                                <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                                            </Button>
                                        </Dropdown> */}

                                                <Input
                                                    suffix={<CiSearch />}
                                                    placeholder="Search with name"
                                                    value={searchQuery}
                                                    style={{ borderRadius: '0' }}
                                                    onChange={handleInputChange}
                                                />
                                            </Space>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        <br />
                        {AllCandidates.length > 0 ?

                            <InfiniteScroll
                                dataLength={AllCandidates.length}
                                next={() => setPagination((prev) => ({ ...prev, page: pagination.page + 1 }))}
                                hasMore={AllCandidates.length < pagination.total}
                                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                endMessage={!loading && <Divider plain></Divider>}
                            >
                                {AllCandidates.filter((item: any) => item._id !== user?._id)
                                    .map((item: any) => (
                                        <>
                                            <div style={{ padding: ' 15px 15px 25px 15px' }}>
                                                <Row gutter={[16, 16]} justify="center">
                                                    <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
                                                        <div className="candidates-details">
                                                            <Row>
                                                                <Col xs={24} sm={24} md={24} lg={2} xl={2} xxl={1} className="">
                                                                    <Image
                                                                        src={
                                                                            item?.image
                                                                                ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${item.image}`
                                                                                : '/images/users.png'
                                                                        }
                                                                        width={50}
                                                                        height={50}
                                                                        alt="user"
                                                                        preview={false}
                                                                        style={{ borderRadius: '50px' }}
                                                                    />
                                                                </Col>
                                                                <Col
                                                                    xs={24}
                                                                    sm={24}
                                                                    md={24}
                                                                    lg={22}
                                                                    xl={22}
                                                                    xxl={23}
                                                                    className="custom-col"
                                                                >
                                                                    <Row gutter={[16, 16]}>
                                                                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ paddingTop: '10px' }}>
                                                                            <Flex align="center">
                                                                                <ParaText
                                                                                    size="small"
                                                                                    color="black"
                                                                                    className="dBlock"
                                                                                    fontWeightBold={600}
                                                                                >
                                                                                    {`${item?.name} `}
                                                                                </ParaText>
                                                                                {/* <Tag color="success" style={{ marginLeft: '8px' }}>
                                                                    {capitalizeFirstLetterOfEachWord(item?.interestedIn)}
                                                                </Tag> */}
                                                                            </Flex>
                                                                            {/* <ParaText size="textGraf" fontWeightBold={600} color="black">
                                                                    {item?.profileTitle &&
                                                                        capitalizeFirstLetterOfEachWord(item?.profileTitle)}
                                                                </ParaText> */}
                                                                            <div className="gapPaddingTopOne"></div>
                                                                            <ParaText
                                                                                size="textGraf"
                                                                                className="dBlock"
                                                                                color="black"
                                                                            >
                                                                                <span>
                                                                                    <strong style={{ fontWeight: '400' }}>
                                                                                        {' '}
                                                                                        Department :
                                                                                    </strong>
                                                                                </span>
                                                                                &nbsp;
                                                                                <ParaText size="textGraf" color="primaryColor">
                                                                                    <span style={{ fontWeight: '400' }}>
                                                                                        {item?.departmentId?.departmentName}
                                                                                    </span>
                                                                                </ParaText>
                                                                            </ParaText>

                                                                            <ParaText
                                                                                size="textGraf"
                                                                                color="black"
                                                                                className="dBlock"
                                                                            >
                                                                                <span>
                                                                                    <strong style={{ fontWeight: '400' }}>
                                                                                        {' '}
                                                                                        Subjects :
                                                                                    </strong>
                                                                                </span>
                                                                                &nbsp;
                                                                                <ParaText size="textGraf" color="primaryColor">
                                                                                    <span style={{ fontWeight: '400' }}>
                                                                                        {item.subjects.length > 0
                                                                                            ? item.subjects.map(
                                                                                                (
                                                                                                    subject: string,
                                                                                                    index: number
                                                                                                ) => (
                                                                                                    <React.Fragment key={index}>
                                                                                                        {index > 0 && ', '}
                                                                                                        {subject}
                                                                                                    </React.Fragment>
                                                                                                )
                                                                                            )
                                                                                            : 'N/A'}
                                                                                    </span>
                                                                                </ParaText>
                                                                            </ParaText>

                                                                            <Flex gap="4px 0" wrap="wrap">
                                                                                {/* <Tag icon={<FaUserGraduate />}>
                                                                    &nbsp;
                                                                    {item?.higherEducation &&
                                                                        capitalizeFirstLetterOfEachWord(item?.higherEducation)}
                                                                </Tag> */}
                                                                                <ParaText size="textGraf" color="black">
                                                                                    <span>
                                                                                        <strong style={{ fontWeight: '400' }}>
                                                                                            {' '}
                                                                                            Skills :
                                                                                        </strong>{' '}
                                                                                        &nbsp;
                                                                                    </span>
                                                                                </ParaText>

                                                                                <ParaText size="textGraf" color="primaryColor">
                                                                                    {item.skills.map(
                                                                                        (skill: string, index: number) => (
                                                                                            <React.Fragment key={index}>
                                                                                                {index > 0 && ', '}
                                                                                                {capitalizeFirstLetterOfEachWord(skill)}
                                                                                            </React.Fragment>
                                                                                        )
                                                                                    )}
                                                                                    {item.skills.length === 0 && (
                                                                                        <span style={{ fontWeight: '400' }}>
                                                                                            No skills specified
                                                                                        </span>
                                                                                    )}
                                                                                </ParaText>
                                                                            </Flex>
                                                                            <ParaText size="textGraf" color="black">
                                                                                <span>
                                                                                    <strong style={{ fontWeight: '400' }}>
                                                                                        {' '}
                                                                                        Languages :
                                                                                    </strong>
                                                                                </span>
                                                                                &nbsp;
                                                                                <ParaText size="textGraf" color="primaryColor">
                                                                                    <span style={{ fontWeight: '400' }}>
                                                                                        {item.languages.length > 0
                                                                                            ? item.languages
                                                                                                .filter((language: any) => languageList.some((lang) => lang.code.toLowerCase() === language.toLowerCase()))
                                                                                                .map((language: any, index: any) => {
                                                                                                    const matchedLanguage = languageList.find((lang) => lang.code.toLowerCase() === language.toLowerCase());
                                                                                                    return (
                                                                                                        <React.Fragment key={index}>
                                                                                                            {index > 0 && ', '}
                                                                                                            {capitalizeFirstLetterOfEachWord(matchedLanguage.name)}
                                                                                                        </React.Fragment>
                                                                                                    );
                                                                                                })
                                                                                            : 'N/A'}
                                                                                    </span>
                                                                                </ParaText>
                                                                            </ParaText>
                                                                            <div>
                                                                                <br className="dNone" />
                                                                                <Space size={[8, 16]} wrap>
                                                                                    {item.socialLinks.facebook !== '' &&
                                                                                        (
                                                                                            <a
                                                                                                href={item.socialLinks.facebook}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                            >
                                                                                                <span>
                                                                                                    <FaFacebookSquare
                                                                                                        size={20}
                                                                                                        color="#1877F2"
                                                                                                    />
                                                                                                </span>
                                                                                            </a>
                                                                                        )
                                                                                    }
                                                                                    {item.socialLinks.instagram !== '' &&
                                                                                        (
                                                                                            <a
                                                                                                href={item.socialLinks.instagram}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                            >
                                                                                                <span>
                                                                                                    <FaInstagramSquare
                                                                                                        color="rgb(225 48 108)"
                                                                                                        size={20}
                                                                                                    />
                                                                                                </span>
                                                                                            </a>
                                                                                        )}
                                                                                    {item.socialLinks.twitter !== '' &&
                                                                                        (
                                                                                            <a
                                                                                                href={item.socialLinks.twitter}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                            >
                                                                                                <span>
                                                                                                    <FaXTwitter
                                                                                                        size={20}
                                                                                                        color="rgb(29 161 242)"
                                                                                                    />
                                                                                                </span>
                                                                                            </a>
                                                                                        )}
                                                                                    {item.socialLinks.likedIn !== 'null' &&
                                                                                        (
                                                                                            <a
                                                                                                href={item.socialLinks.linkedin}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                            >
                                                                                                <span>
                                                                                                    <IoLogoLinkedin
                                                                                                        size={20}
                                                                                                        color="rgb(10, 102, 194)"
                                                                                                    />
                                                                                                </span>
                                                                                            </a>
                                                                                        )}
                                                                                </Space>
                                                                            </div>
                                                                        </Col>
                                                                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                                                            <div className="textEnd">
                                                                                <Tooltip
                                                                                    title={
                                                                                        <span
                                                                                            style={{
                                                                                                color: 'black',
                                                                                                fontWeight: 600
                                                                                            }}
                                                                                        >
                                                                                            Chat now
                                                                                        </span>
                                                                                    }
                                                                                    color={'#EDF1F5'}
                                                                                >
                                                                                    <Image
                                                                                        style={{ cursor: 'pointer' }}
                                                                                        onClick={() => accessChat(item?._id)}
                                                                                        preview={false}
                                                                                        src="/icons/yellowbubble-chat.png"
                                                                                        alt="Active User"
                                                                                        width={20}
                                                                                        height={20}
                                                                                    />
                                                                                </Tooltip>
                                                                                &nbsp;
                                                                                {/* <span>
                                                                        <CiHeart size={30} />
                                                                    </span> */}
                                                                            </div>
                                                                            <div className={item?.profileDescription ? 'candidates-details-chat' : ''}>
                                                                                <ParaText size="textGraf" color="black">
                                                                                    {item?.profileDescription}
                                                                                </ParaText>
                                                                            </div>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </>
                                    ))}
                                {loading && <Skeleton avatar paragraph={{ rows: 1 }} active />}
                            </InfiniteScroll>
                            :
                            <>
                                <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0} className='textCenter'>
                                    <Image
                                        src='/images/no-match.png'
                                        width={'auto'}
                                        height={'auto'}
                                        preview={false}
                                    />
                                    <br />
                                    <ParaText size='extraSmall' color='black'>
                                        Currently, there are no users with matching interests. Please select additional courses or check back later as more users join.
                                    </ParaText>
                                </Col>
                                <Col xs={0} sm={0} md={24} lg={24} xl={24} xxl={24} className='textCenter'>
                                    <Image
                                        src='/images/no-match.png'
                                        width={500}
                                        height={500}
                                        preview={false}
                                    />
                                    <br />
                                    <ParaText size='extraSmall' color='black'>
                                        Currently, there are no users with matching interests. Please select additional courses or check back later as more users join.
                                    </ParaText>
                                </Col>
                            </>
                        }
                    </Col>
                </div>
            }
        </>
    );
}
