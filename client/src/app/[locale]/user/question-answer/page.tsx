'use client'
import { getAllForums } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Avatar, Badge, Col, Divider, Empty, Image, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import './style.css';
import RelativeTime from '@/app/commonUl/RelativeTime';
import ParaText from '@/app/commonUl/ParaText';
import RightSection from '@/components/Forums/SingleForum/RightSection';
import Link from 'next/link';
import { LikeOutlined, DislikeOutlined, UserOutlined, LikeFilled, DislikeFilled, MessageOutlined, EyeFilled } from '@ant-design/icons';
import AuthContext from '@/contexts/AuthContext';
import { submitForumVote } from '@/lib/frontendApi';
interface Forum {
    _id: string;
    title: string;
    slug: string;
    description: string;
    attachment?: string;
    likes: string[];
    dislikes: string[]; // Corrected property name
    comments: any[];
    viewCount: number;
    createdAt: string;
}

export default function Page() {
    const [forums, setForums] = useState<any[]>([]);
    const { user } = useContext(AuthContext);
    const [modal, setModal] = useState(false)
    const [forumResult, setForumResult] = useState<any>([]);
    const [searchQuery, setSearchQuery] = useState<any>();

    useEffect(() => {
        fetchData(searchQuery);
    }, [searchQuery])
    const fetchData = async (searchQuery: any) => {
        try {
            const searchObject = {
                search: searchQuery,
            }
            const res = await getAllForums(searchObject);
            if (res.status == true) {
                setForums(res.data)
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

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
            }

            const res = await submitForumVote(data);
            if (res.status == true) {
                setForums(prevForums =>
                    prevForums.map(forum => {
                        if (forum._id === forumId) {
                            if (vote === 'like') {
                                const hasDisliked = forum.dislikes.includes(user?._id);
                                const hasLiked = forum.likes.includes(user?._id);
                                return {
                                    ...forum,
                                    likes: hasLiked ? forum.likes.filter((id: string | null | undefined) => id !== user?._id) : [...forum.likes, data.userId],
                                    dislikes: hasDisliked ? forum.dislikes.filter((id: string | null | undefined) => id !== user?._id) : forum.dislikes
                                };
                            } else if (vote === 'dislike') {
                                const hasLiked = forum.likes.includes(user?._id);
                                const hasDisliked = forum.dislikes.includes(user?._id);
                                return {
                                    ...forum,
                                    dislikes: hasDisliked ? forum.dislikes.filter((id: string | null | undefined) => id !== user?._id) : [...forum.dislikes, data.userId],
                                    likes: hasLiked ? forum.likes.filter((id: string | null | undefined) => id !== user?._id) : forum.likes
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
        }
        const queryString = JSON.stringify(query);
        setSearchQuery(queryString);
    };

    function handleCallback(data: any) {
        throw new Error('Function not implemented.');
    }



    return (
        <>
            <div className='gapMarginTopTwo'></div>
            <div className='boxInbox'>
                <Row>
                    <Col xs={24} sm={24} md={18} lg={18} xl={18} xxl={18}>
                        {forums.length > 0 ?
                            <Row>
                                {forums.map((forum: any) => {
                                    return (
                                        <>
                                            <Col xs={24} sm={24} md={1248} lg={24} xl={24} xxl={24}>
                                                <div style={{ display: 'flex', gap: '8px' }}>
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
                                                    <div>
                                                        <span style={{ fontSize: '14px' }}>
                                                            {forum.userId.name}
                                                            <Badge status='default' />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="smallTopMargin"></div>
                                                <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                                                    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/user/questions/${forum.slug}`}>
                                                        {forum.title.length > 95 ? `${forum.title.slice(0, 95)}...` : forum.title}
                                                    </Link>
                                                </ParaText>
                                                <div className="smallTopMargin"></div>
                                                {forum.attachment ?
                                                    <Image
                                                        src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/original/${forum.attachment}`}
                                                        alt="Avatar"
                                                        width={'30%'}
                                                        height={'250px'}
                                                        style={{ borderRadius: '5px' }}
                                                        preview={false}
                                                    />
                                                    :
                                                    null
                                                }
                                                <div className="smallTopMargin"></div>
                                                {!forum.attachment &&
                                                    <div dangerouslySetInnerHTML={{ __html: truncateDescription(forum?.description, 200) }}></div>
                                                }
                                                <div className="smallTopMargin"></div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <div style={{ display: 'flex', gap: '10px' }} className='likeCommentRadius'>
                                                        <div style={{ cursor: 'pointer' }} onClick={() => handleVote(forum._id, 'like')}>
                                                            {
                                                                forum.likes.includes(user?._id)
                                                                    ? <LikeFilled style={{ fontSize: '16px' }} />
                                                                    : <LikeOutlined style={{ fontSize: '16px' }} />
                                                            }
                                                            {forum.likes.length}
                                                        </div>
                                                        <div style={{ cursor: 'pointer' }} onClick={() => handleVote(forum._id, 'dislike')}>
                                                            {
                                                                forum.dislikes.includes(user?._id)
                                                                    ? <DislikeFilled style={{ fontSize: '16px' }} />
                                                                    : <DislikeOutlined style={{ fontSize: '16px' }} />
                                                            } {forum.dislikes.length}
                                                        </div>
                                                    </div>
                                                    <div className='likeCommentRadius'>
                                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/user/questions/${forum.slug}`}>
                                                            <MessageOutlined style={{ fontSize: '16px' }} /> {forum.comments.length}
                                                        </Link>
                                                    </div>
                                                    <div className='likeCommentRadius'>
                                                        <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/user/questions/${forum.slug}`}>
                                                            Views {forum.viewCount}
                                                        </Link>
                                                    </div>
                                                </div>
                                                <div className="smallTopMargin"></div>
                                                <div style={{ fontSize: '12px', color: '#888' }}>
                                                    <RelativeTime date={forum.createdAt} />
                                                </div>
                                                <Divider />
                                            </Col>
                                        </>
                                    )
                                })}
                            </Row>
                            :
                            <div className='textCenter'>
                                <Image
                                    width={'50%'}
                                    height={'100%'}
                                    preview={false}
                                    src={'http://localhost:3000/images/Nodata-amico.png'}
                                    alt="card__image"
                                    className="card__image"
                                    fallback='/images/Nodata-amico.png'
                                />
                            </div>
                        }
                    </Col>
                    <Col xs={24} sm={24} md={6} lg={6} xl={6} xxl={6}>
                        <RightSection categoryId={''} onCallBack={(data: any) => { handleCallback(data) }} onSearch={(data: any) => handleSearch(data)} />
                    </Col>
                </Row>
            </div>
        </>

    )
}