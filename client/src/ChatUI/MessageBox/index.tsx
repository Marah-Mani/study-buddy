'use client'
import React, { useContext, useEffect } from 'react'
import { Avatar, Message, MessageSeparator, AvatarGroup, Button } from '@chatscope/chat-ui-kit-react';
import dateFormat from "dateformat";
import { getSender, getSenderFull, isLastMessage, isSameSender } from '@/lib/chatLogics';
import { Dropdown, Tooltip, Avatar as AntdAvatar } from 'antd';
import { BsThreeDotsVertical } from "react-icons/bs";
import moment from 'moment'
import { IoCheckmarkDone } from 'react-icons/io5';
import { MdOutlineAttachment } from "react-icons/md";
import { FiDownload } from "react-icons/fi";
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import ErrorHandler from '@/lib/ErrorHandler';
import { BiBookmark } from 'react-icons/bi';

interface MessageBoxProps {
    messages: any;
    message: any;
    user: any;
    index: number;
    prevDate?: string;
    setPrevDate?: any;
    prevIndex?: number;
    setPrevIndex?: any;
    selectedChat?: any;
    setEditMessage?: any;
    setShowEditMessage?: any;
    handleDeleteForMe?: any;
}

export default function MessageBox({
    messages,
    message,
    user,
    index,
    setPrevDate,
    setPrevIndex,
    selectedChat,
    setEditMessage,
    setShowEditMessage,
    handleDeleteForMe,
}: MessageBoxProps) {
    const date = dateFormat(message.createdAt, "dddd, mmmm dS, yyyy");
    const timeDifference = moment().diff(moment(message.createdAt), 'minutes');
    const token = Cookies.get('session_token')
    const config = {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const handleBookmark = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/common/message/bookmark/${message._id}`,
                config
            );

        } catch (error) {
            new ErrorHandler(error)
        }
    }

    const items: any = [
        timeDifference <= 3 && {
            key: '1',
            label: (
                <span className='textEnd' onClick={() => { setEditMessage(message); setShowEditMessage(true); }}>
                    Edit
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span className='textEnd' onClick={() => handleDeleteForMe(message, [message.sender._id], false)}>
                    Delete for me
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span className='textEnd' onClick={() => handleDeleteForMe(message, message.chat.users, true)}>
                    Delete for all
                </span>
            ),
        },
        {
            key: '4',
            label: (
                <span className='textEnd' onClick={handleBookmark}>
                    {
                        message.bookmark.includes(user._id) ?
                            'Remove from bookmark'
                            :
                            "Add to bookmark"
                    }
                </span>
            ),
        },
    ].filter(Boolean);

    useEffect(() => {
        if (date) {
            setPrevDate(date);
            setPrevIndex(index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);


    return (
        <>
            {
                index == messages.length - selectedChat.unreadCount ?
                    <MessageSeparator>
                        Unread message
                    </MessageSeparator>
                    :
                    ''
            }
            <div style={{ display: 'flex', gap: '0px', alignItems: 'flex-start ' }}>
                <Message
                    // onClick={() => { alert(message._id) }}
                    key={message._id}
                    model={{
                        direction: `${message.sender._id === user._id ? 'outgoing' : 'incoming'}`,
                        message: message.content,
                        position: 'first',
                        sender: getSender(user, selectedChat.users),
                        sentTime: '15 mins ago'
                    }}
                >
                    <Message.CustomContent style={{ backgroundColor: '#6ea9d7 !important' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }} className='textEnd'>
                            <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
                            <p style={{ fontSize: '10px', width: '75px' }}>{dateFormat(message.sentTime || message.createdAt, "h:MM TT")}&nbsp;
                                {
                                    message.sender._id == user._id &&
                                    <IoCheckmarkDone style={{ fontSize: '15px', marginBottom: '-3px', color: `${message.status === 'seen' ? '#8bff54' : '#000'}` }} />
                                }
                                {
                                    message.bookmark.includes(user._id) && <BiBookmark />
                                }

                            </p>
                        </div>
                    </Message.CustomContent>
                    {message.attachment &&
                        (
                            message.attachment.type == 'image/jpeg' ?
                                <Message.ImageContent src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${message.attachment.path}`} alt="Akane avatar" width={200} />
                                :
                                <Message.CustomContent>
                                    <div style={{ textAlign: 'center' }}>
                                        <MessageSeparator />
                                        <MdOutlineAttachment fontSize={30} />
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontSize: '12px' }}>{message?.attachment?.name}</p>
                                            <a style={{ cursor: 'pointer' }} target='_blank' href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${message.attachment.path}`}>
                                                <FiDownload color='#000' />
                                            </a>
                                        </div>
                                    </div>
                                </Message.CustomContent>
                        )
                    }
                    {(isSameSender(messages, message, index, user._id) ||
                        isLastMessage(messages, index, user._id)) && (
                            <Avatar
                                name="Zoe"
                                src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                            />
                        )}
                    <Message.Footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <AntdAvatar.Group
                            maxCount={4}
                            size={'small'}
                            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                        >
                            {
                                message.readBy && selectedChat?.isGroupChat &&
                                message.readBy.map((userData: any, index: number) => (
                                    <>
                                        <Tooltip
                                            color={'#fff'}
                                            placement="bottom"
                                            title={
                                                <>
                                                    <p style={{ color: '#000' }}>{userData.user.name}</p>
                                                    <p style={{ color: '#000' }}>Seen: {moment().tz(userData.seenAt).format('hh:mm a')}</p>
                                                </>
                                            }
                                            arrow={true}
                                            key={`group-user-${index}`}
                                        >
                                            <AntdAvatar size={'small'} style={{ backgroundColor: '#f56a00' }}>
                                                {userData.user?.name?.toUpperCase().split(' ').map((part: any) => part[0]).join('')}
                                            </AntdAvatar>
                                        </Tooltip>

                                    </>
                                ))

                            }
                        </AntdAvatar.Group>
                    </Message.Footer>
                </Message>
                <div style={{ marginTop: '5px' }}>
                    {/* {
                        message.sender._id == user._id && */}
                    <Dropdown trigger={['click']} placement='bottomRight' menu={{ items }}>
                        <BsThreeDotsVertical style={{ fontSize: '14px', cursor: 'pointer' }} />
                    </Dropdown>
                    {/* } */}
                </div>
            </div>
        </>
    )
}
