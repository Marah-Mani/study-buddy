'use client';
import { getAllForums } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Avatar, Badge, Button, Col, Image, Row, Space } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import './style.css';
import RelativeTime from '@/app/commonUl/RelativeTime';
import ParaText from '@/app/commonUl/ParaText';
import RightSection from '@/components/Forums/SingleForum/RightSection';
import Link from 'next/link';
import {
    LikeOutlined,
    UserOutlined,
    LikeFilled,
    MessageOutlined
} from '@ant-design/icons';
import AuthContext from '@/contexts/AuthContext';
import { submitForumVote } from '@/lib/frontendApi';
import { FaPlus } from "react-icons/fa6";
import Forums from '@/components/Admin/Forums';
import { IoIosEye } from 'react-icons/io';

export default function Page() {
    const [forums, setForums] = useState<any[]>([]);
    const { user } = useContext(AuthContext);
    const [modal, setModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState<any>();
    const [allDataType, setAllDataType] = useState(true);
    const [newRecord, setNewRecord] = useState(false);

    useEffect(() => {
        fetchData(searchQuery);
    }, [searchQuery]);
    const fetchData = async (searchQuery: any) => {
        try {
            const searchObject = {
                search: searchQuery
            };
            const res = await getAllForums(searchObject);
            if (res.status == true) {
                setForums(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const truncateDescription = (description: any, maxLength: any) => {
        if (!description) return '';

        // Remove HTML tags from the description
        const plainText = description.replace(/<[^>]+>/g, '');

        // Split the plain text into words
        const words = plainText.split(' ');

        // If the description is already shorter than maxLength, return it as is
        if (words.length <= maxLength) return description;

        // Otherwise, truncate the description to maxLength words
        const truncatedWords = words.slice(0, maxLength);

        // Join the truncated words and add ellipsis
        const truncatedDescription = truncatedWords.join(' ') + '...';

        return truncatedDescription;
    };
    const handleVote = async (forumId: string, vote: any) => {
        try {
            if (!user) {
                setModal(true);
                return;
            }
            const data = {
                forumId: forumId,
                userId: user?._id,
                type: vote
            };

            const res = await submitForumVote(data);
            if (res.status == true) {
                setForums((prevForums) =>
                    prevForums.map((forum) => {
                        if (forum._id === forumId) {
                            if (vote === 'like') {
                                const hasDisliked = forum.dislikes.includes(user?._id);
                                const hasLiked = forum.likes.includes(user?._id);
                                return {
                                    ...forum,
                                    likes: hasLiked
                                        ? forum.likes.filter((id: string | null | undefined) => id !== user?._id)
                                        : [...forum.likes, data.userId],
                                    dislikes: hasDisliked
                                        ? forum.dislikes.filter((id: string | null | undefined) => id !== user?._id)
                                        : forum.dislikes
                                };
                            } else if (vote === 'dislike') {
                                const hasLiked = forum.likes.includes(user?._id);
                                const hasDisliked = forum.dislikes.includes(user?._id);
                                return {
                                    ...forum,
                                    dislikes: hasDisliked
                                        ? forum.dislikes.filter((id: string | null | undefined) => id !== user?._id)
                                        : [...forum.dislikes, data.userId],
                                    likes: hasLiked
                                        ? forum.likes.filter((id: string | null | undefined) => id !== user?._id)
                                        : forum.likes
                                };
                            }
                        }
                        return forum;
                    })
                );
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleSearch = (data: any) => {
        const query = {
            search: data
        };
        const queryString = JSON.stringify(query);
        setSearchQuery(queryString);
    };

    function handleCallback(data: any) {
        throw new Error('Function not implemented.');
    }
    const handleQuestions = (type: string) => {
        if (allDataType) {
            setAllDataType(false);
        } else {
            setAllDataType(true);
            fetchData(searchQuery);
        }
    };

    const handleQuestionssss = (type: string) => {
        if (type === 'new') {
            setNewRecord(true);
        }
        if (allDataType) {
            setAllDataType(false);
        }
    };

    return (
        <>
            <div className="">
                <div>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <Space wrap className="floatEnd">
                                {/* <Input type='search' placeholder='search' value={searchQuery} onChange={handleSearch} style={{ height: '40px' }} /> */}
                                <Button
                                    type="primary"
                                    onClick={() => handleQuestions('')}
                                    style={{ height: '40px', borderRadius: '30px' }}
                                >
                                    {allDataType ? 'My Questions' : 'All Questions'}
                                </Button>
                                <Button
                                    icon={<FaPlus className='iconColorChange' />}
                                    type={'primary'}
                                    onClick={() => handleQuestionssss('new')}
                                    style={{ height: '40px', borderRadius: '30px' }}
                                >
                                    Ask Question
                                </Button>
                            </Space>
                        </Col>
                        <>
                            {allDataType ? (
                                <Col xs={24} sm={24} md={18} lg={24} xl={18} xxl={18}>
                                    {forums.length > 0 ? (
                                        <Row>
                                            {forums.map((forum: any) => {
                                                return (
                                                    <>
                                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                                            <div className="question">
                                                                <Row gutter={[24, 24]}>
                                                                    <Col xs={3} sm={2} md={2} lg={2} xl={1} xxl={1}>
                                                                        <div>
                                                                            {forum.userId.attachment ? (
                                                                                <Image
                                                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${forum.userId.attachment}`}
                                                                                    alt="Avatar"
                                                                                    width={40}
                                                                                    height={40}
                                                                                    style={{ borderRadius: '50px' }}
                                                                                    preview={false}
                                                                                />
                                                                            ) : (
                                                                                <Avatar size={30} icon={<UserOutlined />} />
                                                                            )}
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={21} sm={22} md={22} lg={22} xl={23} xxl={23} >
                                                                        <Row>
                                                                            <Col xs={24} sm={24} md={22} lg={22} xl={22} xxl={22}>
                                                                                <div
                                                                                    style={{
                                                                                        display: 'flex',
                                                                                        gap: '8px',
                                                                                        alignItems: 'center'
                                                                                    }}
                                                                                >
                                                                                    <div>
                                                                                        <span
                                                                                            style={{
                                                                                                fontSize: '14px',
                                                                                                gap: '5px',
                                                                                                display: 'flex'
                                                                                            }}
                                                                                        >
                                                                                            <span>{forum.userId.name}</span>
                                                                                            <span>
                                                                                                <Badge status="default" />
                                                                                            </span>
                                                                                        </span>
                                                                                        <div
                                                                                            style={{
                                                                                                fontSize: '12px',
                                                                                                color: '#f1a638'
                                                                                            }}
                                                                                        >
                                                                                            <RelativeTime date={forum.createdAt} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <ParaText
                                                                                    size="small"
                                                                                    fontWeightBold={600}
                                                                                    color="black"
                                                                                >
                                                                                    <Link
                                                                                        href={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.role}/questions/${forum.slug}`}
                                                                                    >
                                                                                        {forum.title.length > 95
                                                                                            ? `${forum.title.slice(0, 95)}...`
                                                                                            : forum.title}
                                                                                    </Link>
                                                                                </ParaText>
                                                                                <div className="smallTopMargin"></div>
                                                                                {forum.attachment ? (
                                                                                    <Image
                                                                                        src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/original/${forum.attachment}`}
                                                                                        alt="Avatar"
                                                                                        width={'30%'}
                                                                                        height={'250px'}
                                                                                        style={{ borderRadius: '5px' }}
                                                                                        preview={false}
                                                                                    />
                                                                                ) :
                                                                                    <ParaText
                                                                                        size="textGraf"
                                                                                        fontWeightBold={400}
                                                                                        color="black"
                                                                                    >
                                                                                        {!forum.attachment && (
                                                                                            <div
                                                                                                dangerouslySetInnerHTML={{
                                                                                                    __html: truncateDescription(
                                                                                                        forum?.description,
                                                                                                        200
                                                                                                    )
                                                                                                }}
                                                                                            ></div>
                                                                                        )}
                                                                                    </ParaText>}
                                                                                <div style={{ display: 'flex', gap: '10px', paddingTop: '12px' }}>
                                                                                    <div
                                                                                        style={{ display: 'flex', gap: '10px' }}
                                                                                        className="likeCommentRadius"
                                                                                    >
                                                                                        <div
                                                                                            style={{ cursor: 'pointer' }}
                                                                                            onClick={() =>
                                                                                                handleVote(forum._id, 'like')
                                                                                            }
                                                                                        >
                                                                                            {forum.likes.includes(user?._id) ? (
                                                                                                <LikeFilled
                                                                                                    style={{ fontSize: '16px' }}
                                                                                                />
                                                                                            ) : (
                                                                                                <LikeOutlined
                                                                                                    style={{ fontSize: '16px' }}
                                                                                                />
                                                                                            )}
                                                                                            <span
                                                                                                style={{
                                                                                                    fontSize: '12px',
                                                                                                    color: '#000'
                                                                                                }}
                                                                                            >
                                                                                                &nbsp; {forum.likes.length}
                                                                                            </span>
                                                                                        </div>
                                                                                        {/* <div style={{ cursor: 'pointer' }} onClick={() => handleVote(forum._id, 'dislike')}>
                                                                            {
                                                                                forum.dislikes.includes(user?._id)
                                                                                    ? <DislikeFilled style={{ fontSize: '16px' }} />
                                                                                    : <DislikeOutlined style={{ fontSize: '16px' }} />
                                                                            } {forum.dislikes.length}
                                                                        </div> */}
                                                                                    </div>
                                                                                    <div className="likeCommentRadius">
                                                                                        <Link
                                                                                            href={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.role}/questions/${forum.slug}`}
                                                                                        >
                                                                                            <MessageOutlined
                                                                                                style={{ fontSize: '16px' }}
                                                                                            />&nbsp;
                                                                                            <span
                                                                                                style={{
                                                                                                    fontSize: '12px',
                                                                                                    color: '#000'
                                                                                                }}
                                                                                            >
                                                                                                &nbsp; {forum.comments.length}
                                                                                            </span>
                                                                                        </Link>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                            <Col xs={24} sm={24} md={2} lg={2} xl={2} xxl={2} className='textEnd'>
                                                                                {' '}
                                                                                <div className="likeCommentRadius">
                                                                                    <Link
                                                                                        style={{
                                                                                            display: 'flex', alignItems: 'center', float: 'right'
                                                                                        }}
                                                                                        href={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.role}/questions/${forum.slug}`}
                                                                                    >
                                                                                        <IoIosEye size={20} />  &nbsp; {forum.viewCount}
                                                                                    </Link>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    </Col>
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                    </>
                                                );
                                            })}
                                        </Row>
                                    ) : (
                                        <div className="textCenter">
                                            <Image
                                                width={'50%'}
                                                height={'100%'}
                                                preview={false}
                                                src={'http://localhost:3000/images/Nodata-amico.png'}
                                                alt="card__image"
                                                className="card__image"
                                                fallback="/images/Nodata-amico.png"
                                            />
                                        </div>
                                    )}
                                </Col>
                            ) : (
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <Forums
                                        activeKey={''}
                                        newRecord={newRecord}
                                        onBack={handleQuestions}
                                        setNewRecord={setNewRecord}
                                    />
                                </Col>
                            )}
                        </>
                        <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
                            <RightSection
                                categoryId={''}
                                onCallBack={(data: any) => {
                                    handleCallback(data);
                                }}
                                onSearch={(data: any) => handleSearch(data)}
                            />
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    );
}
