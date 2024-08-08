'use client';
import { getAllForums, getForumCategories } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Avatar, Badge, Button, Col, Dropdown, Image, Menu, Result, Row, Space } from 'antd';
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
import { IoIosEye, IoMdArrowDropdown } from "react-icons/io";
import AuthContext from '@/contexts/AuthContext';
import { submitForumVote } from '@/lib/frontendApi';
import { FaCircleQuestion, FaPlus } from 'react-icons/fa6';
import Forums from '@/components/Admin/Forums';
import Loading from '@/app/commonUl/Loading';
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
    const [searchQuery, setSearchQuery] = useState<any>();
    const [allDataType, setAllDataType] = useState(true);
    const [newRecord, setNewRecord] = useState(false);
    const [category, setCategory] = useState<any>([]);
    const [categoryId, setCategoryId] = useState<any>();
    const [subCatId, setSubCatId] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData(searchQuery);
    }, [searchQuery, categoryId, subCatId]);

    useEffect(() => {
        fetchCategories();
    }, [])

    const fetchData = async (searchQuery: any) => {
        try {
            const searchObject = {
                catId: categoryId?._id,
                subCatId: subCatId,
                search: searchQuery
            };
            const res = await getAllForums(searchObject);
            if (res.status == true) {
                setForums(res.data);
                setLoading(false);
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

    const fetchCategories = async () => {
        try {
            const res = await getForumCategories();
            if (res.status == true) {
                setCategory(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handleQuestions = (type: string) => {
        if (allDataType) {
            setAllDataType(false);
        } else {
            setAllDataType(true);
            // fetchData(searchQuery);
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

    const capitalizeFirstLetterOfEachWord = (text: string) => {
        if (!text) return text;
        return text.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const handleDepartmentChange = (e: any) => {
        if (e.key == 'all') {
            setCategoryId(null);
            setSubCatId(null);
            fetchData(searchQuery);
        }
        const selected: any = category.categories.find((item: any) => item._id === e.key);
        setCategoryId(selected);
    };

    const handleCourseChange = (e: any) => {
        const selected: any = category.subCategories.find((item: any) => item._id === e.key);
        setSubCatId(selected);
    }

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        // Initial check
        handleResize();

        // Event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="boxInbox">
                <div>
                    {loading ? <Loading /> :
                        <Row gutter={[12, 12]}>
                            <Col sm={0} xs={0} lg={6} xl={8} xxl={13}></Col>
                            {allDataType &&
                                <Col xs={24} sm={24} md={13} lg={10} xl={9} xxl={6} className={`${isMobile ? 'textCenter' : 'textEnd'}`}>
                                    <Space wrap>
                                        {allDataType &&
                                            <>
                                                <Dropdown
                                                    overlay={
                                                        <div style={{ border: '2px solid #f1a638', borderRadius: '8px' }}>
                                                            <Menu
                                                                onClick={handleDepartmentChange}
                                                            >
                                                                <Menu.Item key={'all'} className='hovercolor'>
                                                                    All
                                                                </Menu.Item>
                                                                {category.categories &&
                                                                    category.categories?.map((item: any) => (
                                                                        <Menu.Item key={item._id} className="hovercolor">
                                                                            {capitalizeFirstLetterOfEachWord(
                                                                                item?.name
                                                                            )}
                                                                        </Menu.Item>
                                                                    ))}
                                                            </Menu>
                                                        </div>
                                                    }
                                                >
                                                    <Button
                                                        style={{
                                                            width: '180px',
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
                                                            {categoryId?.name
                                                                ? capitalizeFirstLetterOfEachWord(
                                                                    categoryId.name
                                                                )
                                                                : 'Select Department'}
                                                        </span>
                                                        <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                                                    </Button>
                                                </Dropdown>
                                            </>
                                        }
                                        {allDataType &&
                                            <>
                                                <Dropdown
                                                    overlay={
                                                        <div style={{ border: '2px solid #f1a638', borderRadius: '8px' }}>
                                                            <Menu
                                                                onClick={handleCourseChange}
                                                            >
                                                                {categoryId?._id
                                                                    && category.subCategories
                                                                        ?.filter((item: any) => item.categoryId === categoryId._id)
                                                                        .map((item: any) => (
                                                                            <Menu.Item key={item._id} className="hovercolor">
                                                                                {capitalizeFirstLetterOfEachWord(item.name)}
                                                                            </Menu.Item>
                                                                        ))
                                                                }
                                                            </Menu>
                                                        </div>
                                                    }
                                                >
                                                    <Button
                                                        style={{
                                                            width: '180px',
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
                                                            {subCatId?.name
                                                                ? capitalizeFirstLetterOfEachWord(
                                                                    subCatId.name
                                                                )
                                                                : 'Select Course'}
                                                        </span>
                                                        <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                                                    </Button>
                                                </Dropdown>
                                            </>
                                        }
                                    </Space>
                                </Col>
                            }
                            <Col xs={24} sm={24} md={11} lg={8} xl={7} xxl={5} className={`${isMobile ? 'textCenter' : ''}`}>
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        onClick={() => handleQuestions('')}
                                        style={{ borderRadius: '30px' }}
                                        icon={<FaCircleQuestion className='iconColorChange' />}
                                    >
                                        {allDataType ? 'My Questions' : 'All Questions'}
                                    </Button>
                                    <Button
                                        icon={<FaPlus className='iconColorChange' />}
                                        type={'primary'}
                                        onClick={() => handleQuestionssss('new')}
                                        style={{ borderRadius: '30px' }}
                                    >
                                        Ask Question
                                    </Button>
                                </Space>
                            </Col>
                            {allDataType ? (
                                <>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={18} xxl={18}>
                                        {forums.length > 0 ? (
                                            <Row>
                                                {forums.map((forum: any) => {
                                                    return (
                                                        <>
                                                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                                                <div className="question">
                                                                    <Row gutter={[16, 16]}>
                                                                        <Col xs={24} sm={2} md={2} lg={2} xl={1} xxl={1}>
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
                                                                                    <Avatar
                                                                                        size={30}
                                                                                        icon={<UserOutlined />}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </Col>
                                                                        <Col xs={24} sm={22} md={22} lg={22} xl={22} xxl={23}>
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
                                                                                        color: '#efa24b'
                                                                                    }}
                                                                                >
                                                                                    <RelativeTime
                                                                                        date={forum.createdAt}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div >
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
                                                                                    <img
                                                                                        src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/original/${forum.attachment}`}
                                                                                        alt="Avatar"
                                                                                        className='imageSize'
                                                                                        style={{ borderRadius: '5px' }}

                                                                                    />
                                                                                ) : null}
                                                                                <div className="smallTopMargin"></div>
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
                                                                                <div className="smallTopMargin"></div>
                                                                                <div style={{ display: 'flex', gap: '10px' }}>
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
                                                                                            &nbsp;
                                                                                            {forum.likes.length}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="likeCommentRadius">
                                                                                        <Link
                                                                                            href={`${process.env.NEXT_PUBLIC_SITE_URL}/${user?.role}/questions/${forum.slug}`}
                                                                                        >
                                                                                            <MessageOutlined
                                                                                                style={{ fontSize: '16px' }}
                                                                                            />{' '}
                                                                                            {forum.comments.length}
                                                                                        </Link>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
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
                                                <Result
                                                    status="404"
                                                    subTitle="Oops! We couldn't find any matching records."
                                                />
                                            </div>
                                        )}
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={6} xxl={6}>
                                        <RightSection
                                            categoryId={''}
                                            onSearch={(data: any) => handleSearch(data)}
                                        />
                                    </Col>
                                </>
                            ) : (
                                <>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                        <Forums
                                            activeKey={''}
                                            newRecord={newRecord}
                                            onBack={handleQuestions}
                                            setNewRecord={setNewRecord}
                                        />
                                    </Col>
                                </>
                            )}
                        </Row>
                    }
                </div>
            </div>
        </>
    );
}
