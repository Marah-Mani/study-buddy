import React, { useEffect, useRef } from 'react';
import { Message, MessageSeparator } from '@chatscope/chat-ui-kit-react';
import dateFormat from 'dateformat';
import moment from 'moment';
import { IoCheckmarkDone } from 'react-icons/io5';
import { MdOutlineAttachment } from 'react-icons/md';
import { FiDownload } from 'react-icons/fi';
import { BiBookmark, BiVideo } from 'react-icons/bi';
import Link from 'next/link';
import { Dropdown, Tooltip, Avatar as AntdAvatar, Checkbox } from 'antd';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios';
import Cookies from 'js-cookie';
import ErrorHandler from '@/lib/ErrorHandler';
import { getSender } from '@/lib/chatLogics';
import TextToSpeech from '../TextToSpeech';
import './style.css'

interface MessageBoxProps {
    messages: any[];
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
    search?: string;
    onReload: any;
    enableSelect: Boolean;
    onEnableCheck: any;
    onCheckedId: (messageId: string, isChecked: boolean) => void;
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
    search = '',
    onReload,
    enableSelect,
    onEnableCheck,
    onCheckedId
}: MessageBoxProps) {
    const messageRef = useRef<(HTMLDivElement | null)[]>([]);
    const date = dateFormat(message.createdAt, 'dddd, mmmm dS, yyyy');
    const timeDifference = moment().diff(moment(message.createdAt), 'minutes');
    const token = Cookies.get('session_token');
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    const handleBookmark = async () => {
        try {
            await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/common/message/bookmark/${message._id}`,
                config
            );
            onReload();
        } catch (error) {
            new ErrorHandler(error);
        }
    };

    function stripHtml(html: any) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    const items: any = [
        timeDifference <= 3 && {
            key: '1',
            label: (
                <span className="textEnd" onClick={() => { setEditMessage(message); setShowEditMessage(true); }}>
                    Edit
                </span>
            ),
        },
        {
            key: '2',
            label: (
                <span className="textEnd" onClick={() => handleDeleteForMe(message, [message.sender._id], false)}>
                    Delete for me
                </span>
            ),
        },
        {
            key: '3',
            label: (
                <span className="textEnd" onClick={() => handleDeleteForMe(message, message.chat.users, true)}>
                    Delete for all
                </span>
            ),
        },
        {
            key: '4',
            label: (
                <span className="textEnd" onClick={handleBookmark}>
                    {message.bookmark.includes(user._id) ? 'Remove from bookmark' : 'Add to bookmark'}
                </span>
            ),
        },
        {
            key: '5',
            label: (
                <span className="textEnd" onClick={() => { onEnableCheck(true) }}>
                    Select Message
                </span>
            )
        },
        {
            key: '6',
            label: (
                (message?.attachment?.type !== 'image/jpeg' && message?.attachment?.type !== 'audio/mp3') && (
                    <span className="textEnd">
                        <TextToSpeech text={stripHtml(message.content)} />
                        {message?.attachment?.type}
                    </span>
                )
            )
        }

    ].filter(Boolean);

    useEffect(() => {
        if (date) {
            setPrevDate(date);
            setPrevIndex(index);
        }
    }, [date]);

    useEffect(() => {
        if (search) {
            const element = messageRef.current.find((el) => el?.innerHTML.includes(search));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [search]);

    const highlightText = (text: string, search: string) => {
        if (!search) return text;
        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

    return (
        <>
            {index === messages.length - selectedChat.unreadCount && (
                <MessageSeparator>
                    Unread message
                </MessageSeparator>
            )}
            <div ref={(el) => (messageRef.current[index] = el)} style={{ display: 'flex', gap: '0px', alignItems: 'flex-start ' }}>
                <Message
                    key={message._id}
                    model={{
                        direction: `${message.sender._id === user._id ? 'outgoing' : 'incoming'}`,
                        message: '',
                        position: 'first',
                        sender: getSender(user, selectedChat.users),
                        sentTime: '15 mins ago',
                    }}
                >
                    <Message.CustomContent style={{ backgroundColor: '#6ea9d7 !important' }}>
                        {message.meetingId !== null && (
                            <>
                                <i style={{ display: 'flex', alignItems: 'center' }}>
                                    <b>
                                        Meeting scheduled for {dateFormat(message.meetingStartTime, 'mm-dd-yy, h:MM TT')}.
                                    </b>
                                    <Link href={message.senderId === user._id ? message.startUrl : message.joinUrl} target='_blank'>
                                        <BiVideo style={{ fontSize: '28px' }} />
                                    </Link>
                                </i>
                                <br />
                            </>
                        )}
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }} className="textEnd">
                            <div
                                style={{ fontSize: '12px' }}
                                dangerouslySetInnerHTML={{ __html: highlightText(message.content, search) }}
                            ></div>
                            <p style={{ fontSize: '12px', width: '75px' }}>
                                {dateFormat(message.sentTime || message.createdAt, 'h:MM TT')}&nbsp;
                                {message.sender._id === user._id && (
                                    <IoCheckmarkDone
                                        style={{ fontSize: '17px', marginBottom: '-3px', color: message.status === 'seen' ? 'rgb(68 167 22)' : '#000' }}
                                    />
                                )}
                                {message.bookmark.includes(user._id) && <BiBookmark />}
                            </p>
                        </div>
                    </Message.CustomContent>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', maxWidth: '660px' }} className="textEnd">
                        <div
                            style={{ fontSize: '12px' }}
                            dangerouslySetInnerHTML={{ __html: highlightText(message.content, search) }}
                        ></div>
                        <p style={{ fontSize: '12px', width: '75px' }}>
                            {dateFormat(message.sentTime || message.createdAt, 'h:MM TT')}&nbsp;
                            {message.sender._id === user._id && (
                                <IoCheckmarkDone
                                    style={{ fontSize: '17px', marginBottom: '-3px', color: message.status === 'seen' ? 'rgb(68 167 22)' : '#000' }}
                                />
                            )}
                            {message.bookmark.includes(user._id) && <BiBookmark />}
                        </p>
                    </div>
                    {
                        message.attachment && (
                            message.attachment.type === 'image/jpeg' || message.attachment.type === 'image/png' || message.attachment.type === 'image/jpg' ? (
                                <Message.ImageContent src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${message.attachment.path}`} alt="Attachment" width={200} height={200} />
                            ) : message.attachment.type === 'audio/mp3' ? (
                                <Message.CustomContent>
                                    <audio controls>
                                        <source src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${message.attachment.path}`} type="audio/mp3" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </Message.CustomContent>
                            ) : (
                                <Message.CustomContent>
                                    <div style={{ textAlign: 'center' }}>
                                        <MessageSeparator />
                                        <MdOutlineAttachment fontSize={30} />
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontSize: '12px' }}>{message.attachment.name}</p>
                                            <a style={{ cursor: 'pointer' }} target="_blank" rel="noopener noreferrer" href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${message.attachment.path}`}>
                                                <FiDownload color="#000" />
                                            </a>
                                        </div>
                                    </div>
                                </Message.CustomContent>
                            )

                        )
                    }
                    <Message.Footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <AntdAvatar.Group
                            maxCount={4}
                            size="small"
                            maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                        >
                            {message.readBy && selectedChat?.isGroupChat && message.readBy.map((userData: any, index: number) => (
                                <Tooltip
                                    color="#fff"
                                    placement="bottom"
                                    title={
                                        <>
                                            <p style={{ color: '#000' }}>{userData.user.name}</p>
                                            <p style={{ color: '#000' }}>Seen: {moment(userData.seenAt).format('hh:mm a')}</p>
                                        </>
                                    }
                                    arrow
                                    key={`group-user-${index}`}
                                >
                                    <AntdAvatar size="small" style={{ backgroundColor: '#f56a00' }}>
                                        {userData.user?.name?.toUpperCase().split(' ').map((part: any) => part[0]).join('')}
                                    </AntdAvatar>
                                </Tooltip>
                            ))}
                        </AntdAvatar.Group>
                    </Message.Footer>
                </Message>
                <div style={{ marginTop: '5px' }}>
                    {message.sender._id === user._id && !enableSelect && (
                        <Dropdown trigger={['click']} placement="bottomRight" menu={{ items }}>
                            <BsThreeDotsVertical style={{ fontSize: '14px', cursor: 'pointer' }} />
                        </Dropdown>
                    )}
                    {(message.sender._id === user._id && enableSelect &&
                        <Checkbox
                            onChange={(event) => onCheckedId(message, event.target.checked)}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
