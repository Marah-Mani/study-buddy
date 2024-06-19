'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    MessageInput,
    ConversationHeader,
    Sidebar,
    MessageSeparator,
    ExpansionPanel,
    TypingIndicator,
    InputToolbox
} from '@chatscope/chat-ui-kit-react';
import moment from 'moment-timezone';
import MyChats from '../MyChats';
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import io from "socket.io-client";
import ErrorHandler from '@/lib/ErrorHandler';
import MessageBox from '../MessageBox';
import { Button, DatePicker, Form, Image, Input, List, Modal, Tooltip, Avatar as AntdAvatar, Dropdown, MenuProps, Popover, Col, Card, Row, Tag, Popconfirm, message } from 'antd';
import { GrDocumentCsv } from 'react-icons/gr';
import { BiDownload, BiTrash, BiVideo } from 'react-icons/bi';
import { useFilePicker } from 'use-file-picker';
import ProfileModal from '../ProfileModal';
import UpdateGroupChatModal from '../UpdateGroupChatModal';
import { FaEllipsisV, FaInfo, FaStar, FaVideo } from 'react-icons/fa';
import TimeAgo from 'react-timeago'
const ENDPOINT = "http://localhost:3001";
var socket: any, selectedChatCompare: any;
import dateFormat from "dateformat";
import Link from 'next/link';
import StringAvatar from '@/app/commonUl/StringAvatar';
import CreateMeetingModal from '@/components/CreateMeetingModal';
import AuthContext from '@/contexts/AuthContext';
import TimeZoneDifference from '../TimeZoneDifference';
import { BsEmojiFrown } from 'react-icons/bs';
import CreateTodoModal from '@/components/CreateTodoModal';
import { deleteTodo, getAllTodo } from '@/lib/commonApi';
import Filter from 'bad-words'
import { bannedWords, getSender, getSenderFull } from '@/lib/chatLogics';

const { TextArea } = Input;
interface DataType {
    content: string,
    sentTime: any,
    _id: string
}

interface BookmarkDataType {
    content: string,
    createdAt: any,
    _id: string
}

export default function Chat() {
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showCreateMeetingForm, setShowCreateMeetingForm] = useState<boolean>(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const {
        selectedChat,
        setSelectedChat,
        setNotification,
        notification,
        setOnlineUsers,
        onlineUsers,
        user,
        setFetchAgain,
        setChats,
        chats,
        setFavourite,
        favourites,
        fetchAgain,
    }: any = useContext(ChatContext)
    const { setUser } = useContext(AuthContext)
    const [prevDate, setPrevDate] = useState<any>('')
    const [prevIndex, setPrevIndex] = useState<any>()
    const [viewInfo, setViewInfo] = useState<boolean>(true)
    const [viewProfile, setViewProfile] = useState(false)
    const [loadingComplete, setLoadingComplete] = useState(false)
    const [editMessage, setEditMessage] = useState<any>([])
    const [showEditMessage, setShowEditMessage] = useState<any>(false)
    const [ScheduledMessages, setScheduledMessages] = useState<DataType[]>([]);
    const [reload, setReload] = useState(false)
    const [stickyNote, setStickyNote] = useState('')
    const [stickyNoteId, setStickyNoteId] = useState('')
    const [files, setFiles] = useState<any>([])
    const getListRef = () => document.querySelector("[data-cs-message-list]");
    const token = Cookies.get('session_token')
    const [form] = Form.useForm()
    const [counter, setCounter] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [bookmarkMessages, setBookmarkMessages] = useState<BookmarkDataType[]>()
    const [eventType, setEventType] = useState('');
    const [allTask, setAllTask] = useState([]);
    const [loading, setLoading] = useState(false)
    const [meetings, setMeetings] = useState<any>()


    const handleDelete = async (taskId: string) => {
        const deleteData = {
            userId: user?._id,
            id: taskId
        }
        const res = await deleteTodo(deleteData);
        if (res.status == true) {
            message.success(res.message);
            fetchAllTask();
        } else {
            message.error(res.message);
        }
    };

    useEffect(() => {
        selectedChat && fetchAllTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, selectedChat]);


    const fetchAllTask = async () => {
        try {
            const response = await getAllTodo({ chatId: selectedChat._id });
            setAllTask(response.data);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    const config = {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    const heightRef: any = useRef(null);

    useEffect(() => {
        if (loadingComplete) return
        const list: any = getListRef();

        if (heightRef.current !== null && !loadingMore) {
            list.scrollTop = list.scrollHeight - heightRef.current;
            heightRef.current = 0;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingMore]);

    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: ['.json', '.pdf', '.jpg', '.jpeg', '.png'],
        multiple: true,
        onFilesSuccessfullySelected: async ({ plainFiles }) => {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            };

            const formData = new FormData();
            plainFiles.forEach(file => {
                formData.append('sampleFile', file);
            });

            try {
                const { data } = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/upload`,
                    formData,
                    config
                );
                sendMessage(data._id, data.name)
            } catch (error) {
                console.error('Error uploading files:', error);
            }
        },
    });

    const fetchMessages = async () => {
        if (!selectedChat && loadingComplete) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    count: counter
                }
            };

            // setLoading(true);

            let { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/common/message/${selectedChat._id}`,
                config
            );
            // data = data.reverse();
            if (data.length === 0) setLoadingComplete(true);
            const bookmarkMessage: any = []
            const meetingData: any = []
            data.map((item: any) => {
                if (item.bookmark.includes(user?._id)) {
                    bookmarkMessage.push(item)
                }
                if (item.meetingId !== null) {
                    meetingData.push(item)
                }
            })
            setMeetings(meetingData)
            setBookmarkMessages(bookmarkMessage)
            setMessages(data);
            // setLoading(false);
            setLoadingMore(false)
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            new ErrorHandler(error)
        }
    };

    const fetchMessageOnScroll = async () => {
        if (!selectedChat && loadingComplete) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    count: counter
                }
            };

            // setLoading(true);

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/common/message/${selectedChat._id}`,
                config
            );
            if (data.length === 0) setLoadingComplete(true);
            setMessages([...data.reverse(), ...messages]);
            // setLoading(false);
            setLoadingMore(false)
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            new ErrorHandler(error)
        }
    };

    const handleScheduledMessage = (values: any) => {
        values.createdAt = values.sentTime
        sendMessage(null, null, values, 'scheduled')
    }

    const sendMessage = async (attachmentId: any = null, name: any = null, values: any = null, status: string = 'sent') => {
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            setNewMessage("");
            const filter = new Filter();
            filter.addWords(...bannedWords);

            const content = filter.clean(name ? name : newMessage);
            const formData = {
                content: content,
                chatId: selectedChat,
                attachmentId: attachmentId,
                status: status,
                ...values
            }
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/common/message`,
                formData,
                config
            );
            socket.emit("new message", data);
            if (data.status !== 'scheduled') {
                setMessages([...messages, data]);
                setFetchAgain(!fetchAgain)
                setSelectedChat({ ...selectedChat, unreadCount: 0 })
            }

            setReload(!reload)
        } catch (error) {
            new ErrorHandler(error)
        }
    };

    useEffect(() => {
        if (user) {
            socket = io(ENDPOINT);
            socket.emit("setup", user);
            socket.on("connected", () => setSocketConnected(true));
            socket.on("new-user-add", user._id);
            socket.on("typing", () => setIsTyping(true));
            socket.on("stop typing", () => setIsTyping(false));
            socket.emit("new-user-add", user._id);
            socket.on("get-users", (users: any) => {
                setOnlineUsers(users);
            });
        }
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        if (selectedChat) {
            setStickyNote(selectedChat.stickyMessage?.message)
            setStickyNoteId(selectedChat.stickyMessage?._id)
        }
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        fetchMessages();
        // eslint-disable-next-line
    }, [selectedChat]);

    const handleSelectChat = async (chat: any) => {
        if (selectedChat && chat._id == selectedChat._id) {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/common/chat/seen`, { chatId: chat._id, userId: user?._id }, config);
            const updatedChats = chats.map((c: any) => {
                if (c._id === chat._id) {
                    return { ...c, unreadCount: 0 };
                }
                return c;
            });
            setChats(updatedChats);
        }
    }

    useEffect(() => {
        if (user && socketConnected) {
            socket.on("message received", (newMessageReceived: any) => {
                if (
                    !selectedChatCompare ||
                    selectedChatCompare._id !== newMessageReceived.chat._id
                ) {
                    if (!notification.includes(newMessageReceived)) {
                        setNotification([newMessageReceived, ...notification]);
                    }
                } else {
                    handleSelectChat(newMessageReceived.chat)
                    setMessages([...messages, newMessageReceived]);
                }
                setFetchAgain(!fetchAgain);
            });

            socket.on("message deleted", (messageDeleted: any) => {
                setMessages((prevMessages: any) =>
                    prevMessages.map((m: any) => {
                        if (m._id === messageDeleted._id) {
                            return messageDeleted;
                        }
                        return m;
                    })
                );
                setFetchAgain(!fetchAgain);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

    const typingHandler = (value: string) => {
        setNewMessage(value);
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const handleEditMessage = async (values: any) => {
        socket.emit("stop typing", selectedChat._id);
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/common/message`,
                {
                    content: values.content,
                    chatId: selectedChat,
                    messageId: editMessage._id
                },
                config
            );

            socket.emit("new message", data);
            setMessages((prevMessages: any) =>
                prevMessages.map((m: any) => {
                    if (m._id === data._id) {
                        return data;
                    }
                    return m;
                })
            );
            setFetchAgain(!fetchAgain);
            setEditMessage(null);
            setShowEditMessage(false)
        } catch (error) {
            new ErrorHandler(error)
        }
    }

    const handleDeleteForMe = async (message: any, deleteFor: any[], deleteForEveryone: boolean = false) => {
        try {
            const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/common/message/delete`,
                {
                    messageId: message._id,
                    deleteFor: deleteFor,
                    deleteForEveryone: deleteForEveryone
                },
                config
            );

            socket.emit("delete message", data);

            setMessages((prevMessages: any) =>
                prevMessages.map((m: any) => {
                    if (m._id === data._id) {
                        return data;
                    }
                    return m;
                })
            );
            setFetchAgain(!fetchAgain);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    if (selectedChat) {
        setInterval(() => {
            socket.emit("scheduled message", selectedChat);
        }, 30000)
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/common/message/scheduled/${selectedChat._id}`,
                    config
                );
                setScheduledMessages(data)
                form.resetFields()
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        selectedChat && chatFiles(selectedChat._id)
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewInfo, reload, selectedChat])

    const deleteScheduledMessage = async (id: string) => {
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/common/message/delete/${id}`,
            config
        );
        setReload(!reload)
    }

    const chatFiles = async (chatId: string) => {
        const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/common/chat/files/${chatId}`,
            config
        );
        setFiles(data)
    }

    const storeStickyNote = async (value: string) => {
        try {
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/sticky-note`,
                {
                    stickyNoteId: stickyNoteId,
                    userId: user._id,
                    chatId: selectedChat._id,
                    message: value
                },
                config
            );
            setStickyNoteId(data._id);

            const updatedChats = chats.map((chat: any) => {
                if (chat._id == selectedChat._id) {
                    return { ...chat, stickyMessage: data };
                } else {
                    return chat;
                }
            });

            const updatedFavChats = favourites.map((chat: any) => {
                if (chat._id == selectedChat._id) {
                    return { ...chat, stickyMessage: data };
                } else {
                    return chat;
                }
            });

            setChats(updatedChats);
            setFavourite(updatedFavChats);

            setSelectedChat({ ...selectedChat, stickyMessage: data });
        } catch (error) {
            new ErrorHandler(error);
        }
    };

    const handleFavourite = async () => {
        try {
            const { data } = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/favourite`,
                {
                    userId: user._id,
                    chatId: selectedChat._id
                },
                config
            );
            setReload(!reload)
        } catch (error) {
            new ErrorHandler(error)
        }
    }

    const items: MenuProps['items'] = [
        {
            label: 'Clear chat',
            key: '0',
            onClick: () => {
                handleClearChat();
            },
        },
        {
            label: 'Delete chat',
            key: '1',
            onClick: () => {
                handleDeleteChat();
            },
        },
        {
            label: selectedChat && user.block.includes(getSenderFull(user, selectedChat.users)._id) ? 'Unblock' : 'Block',
            key: '2',
            onClick: () => {
                handleBlockUser();
            },
        },
        {
            label: 'Mark as read',
            key: '3',
            onClick: () => {
                handleMarkRead();
            },
        },
    ];

    const handleClearChat = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/clear-chat/${selectedChat._id}`,
                config
            );
            if (data) setMessages([])
        } catch (error) {
            new ErrorHandler(error)
        }
    }

    const handleDeleteChat = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/delete-chat/${selectedChat._id}`,
                config
            );
            if (data) {
                setMessages(undefined)
                setSelectedChat(undefined)
                setFetchAgain(!fetchAgain)
            }
        } catch (error) {
            new ErrorHandler(error)
        }
    }

    const handleMarkRead = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/mark-read/?read=${true}&chatId=${selectedChat._id}`,
                config
            );
            if (data) {
                setMessages(undefined)
                setSelectedChat(undefined)
                setFetchAgain(!fetchAgain)
            }
            message.success('Saved.')
        } catch (error) {
            new ErrorHandler(error)
        }
    }

    const handleBlockUser = async () => {
        try {
            const senderId = getSenderFull(user, selectedChat.users)._id

            if (!senderId) {
                throw new Error("Sender ID not found");
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/block`,
                { userId: senderId },
                config
            );

            if (response.data) {
                setFetchAgain(!fetchAgain);
            }
        } catch (error) {
            console.error("Error blocking user:", error);
            new ErrorHandler(error);
        }
    };

    const onEmojiClick = (emojiObject: any, event: any) => {
        setNewMessage((prevInput: any) => prevInput + emojiObject.emoji);
        console.log(emojiObject)
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEventType('');
    };

    const onYReachStart = () => {
        if (loadingMore === true || heightRef.current > 0) {
            return;
        }
        setLoadingMore(true);
        setCounter(counter + 40)
        const list: any = getListRef();
        heightRef.current = list.scrollHeight;
    };

    return (
        <MainContainer
            responsive
            style={{
                height: '80vh', marginTop: '10vh'
            }}
        >
            <MyChats />
            {
                selectedChat &&
                <ChatContainer data-message-list-container>
                    <ConversationHeader>
                        <ConversationHeader.Back />
                        <ConversationHeader.Content>
                            <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <StringAvatar
                                        email={getSender(user, selectedChat.users).email}
                                        key={`chat-${selectedChat._id}`}
                                        name={`${selectedChat &&
                                            !selectedChat.isGroupChat ?
                                            getSender(user, selectedChat.users)
                                            :
                                            selectedChat.chatName}`}
                                        user={getSenderFull(user, selectedChat.users)}
                                    />
                                </div>
                                <div>
                                    <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                                        {`${selectedChat && (selectedChat.isGroupChat ? selectedChat.chatName : getSender(user, selectedChat.users))}`}
                                        &nbsp;<span style={{ fontSize: "12px", fontWeight: '400', color: 'rgba(0,0,0,.6)' }}>
                                            {onlineUsers.some((userData: any) => userData.userId == getSenderFull(user, selectedChat.users)._id) ?
                                                'Online' :
                                                <>Online <TimeAgo date={getSenderFull(user, selectedChat.users)?.lastSeen} /></>}</span>
                                    </p>
                                    <p style={{ fontSize: "12px", fontWeight: '400', color: 'rgba(0,0,0,.6)' }}>
                                        {
                                            user.block.includes(getSenderFull(user, selectedChat.users)._id) ? (
                                                <p>You blocked this user.</p>
                                            ) :
                                                !selectedChat.isGroupChat &&
                                                <span>
                                                    Current time: {moment().tz(user.timeZone).format('hh:mm a')}&nbsp;
                                                    {selectedChat && <TimeZoneDifference timeZone1={user?.timeZone} timeZone2={getSenderFull(user, selectedChat.users).timeZone} />}
                                                </span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </ConversationHeader.Content>
                        <ConversationHeader.Actions>
                            <Button icon={<FaInfo />} onClick={() => setViewInfo(!viewInfo)} />&nbsp;
                            <Button onClick={() => setShowCreateMeetingForm(true)} icon={<FaVideo />} />&nbsp;
                            <Button icon={<FaStar color={`${selectedChat.favourites.includes(user?._id) ? '#000' : '#ccc'}`} />} onClick={handleFavourite} />&nbsp;
                            <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']}>
                                <Button icon={<FaEllipsisV />} />
                            </Dropdown>
                        </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList
                        loadingMore={loadingMore}
                        // onYReachStart={onYReachStart}
                        // style={{ height: "500px" }}
                        typingIndicator={isTyping && <TypingIndicator content={`${getSenderFull(user, selectedChat.users).name} is typing`} />}
                    >
                        {messages &&
                            messages.map((m: any, i: number) => (
                                (!m.deleteFor.includes(user._id) && !m.deleteForEveryone) && (
                                    <MessageBox
                                        key={m._id}
                                        messages={messages}
                                        message={m}
                                        index={i}
                                        user={user}
                                        prevDate={prevDate}
                                        setPrevDate={setPrevDate}
                                        prevIndex={prevIndex}
                                        setPrevIndex={setPrevIndex}
                                        selectedChat={selectedChat}
                                        setEditMessage={setEditMessage}
                                        setShowEditMessage={setShowEditMessage}
                                        handleDeleteForMe={handleDeleteForMe}
                                    />
                                )
                            ))
                        }
                    </MessageList>
                    <MessageInput
                        onAttachClick={() => openFilePicker()}
                        // attachButton={false}
                        onChange={typingHandler}
                        placeholder={user.block.includes(getSenderFull(user, selectedChat.users)._id) ? 'You blocked this user' : 'Type message here'}
                        onSend={() => sendMessage(null, newMessage)}
                        disabled={user.block.includes(getSenderFull(user, selectedChat.users)._id)}
                        value={newMessage}
                    />
                    {/* <InputToolbox>
                        <Popover content={<EmojiPicker
                            onEmojiClick={onEmojiClick}
                        />} title="Title" trigger="click">
                            <Button icon={<BsEmojiFrown />} />
                        </Popover>
                    </InputToolbox> */}
                </ChatContainer>
            }
            {
                viewInfo &&
                <Sidebar position="right">
                    <div>
                        <div
                            className="right-profile-box"
                            style={{
                                marginTop: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: "100%",
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                                {selectedChat &&
                                    !selectedChat?.isGroupChat ?
                                    <div style={{ position: 'relative' }}>
                                        <StringAvatar
                                            email={getSender(user, selectedChat.users).email}
                                            key={`chat-${selectedChat._id}`}
                                            name={selectedChat && !selectedChat.isGroupChat ?
                                                getSender(user, selectedChat.users) :
                                                selectedChat.chatName}
                                        />
                                        <div
                                            style={{
                                                width: '13px',
                                                height: '13px',
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                background:
                                                    onlineUsers.includes(getSenderFull(user, selectedChat.users)._id) ?
                                                        'radial-gradient(circle at 3px 3px,#00d5a6,#00a27e)' :
                                                        'radial-gradient(circle at 3px 3px,#fffccc,#ffee00)',
                                                borderRadius: '50px',
                                                border: '2px solid #fff'
                                            }}></div>
                                    </div>
                                    :
                                    <AntdAvatar.Group
                                        maxCount={2}
                                        size="large"
                                        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                    >
                                        {selectedChat &&
                                            selectedChat.users.map((userData: any, index: number) => (
                                                <>
                                                    <Tooltip
                                                        color={'#fff'}
                                                        placement="bottom"
                                                        title={
                                                            <>
                                                                <p style={{ color: '#000' }}>{userData.name}</p>
                                                                <p style={{ color: '#000' }}>
                                                                    {onlineUsers.some((onlineUser: any) => onlineUser.userId == userData._id)
                                                                        ? 'Online'
                                                                        : <TimeAgo date={getSenderFull(user, selectedChat.users)?.lastSeen} />
                                                                    }
                                                                </p>
                                                                <p style={{ color: '#000' }}>Current time: {moment().tz(user.timeZone).format('hh:mm a')}</p>
                                                            </>
                                                        }
                                                        arrow={true}
                                                        key={`group-user-${index}`}
                                                    >
                                                        <AntdAvatar style={{ backgroundColor: '#f56a00' }}>
                                                            {userData.name.toUpperCase().split(' ').map((part: any) => part[0]).join('')}
                                                        </AntdAvatar>
                                                    </Tooltip>

                                                </>
                                            ))
                                        }
                                    </AntdAvatar.Group>
                                }
                            </div>
                            <h4>{selectedChat && !selectedChat.isGroupChat
                                ? getSender(user, selectedChat.users)
                                : selectedChat?.chatName}</h4>
                            <p>{selectedChat && !selectedChat.isGroupChat && getSenderFull(user, selectedChat.users).email}</p>
                        </div>
                        <div className="right-profile-box" style={{ marginBottom: '20px' }}></div>
                        <MessageSeparator />
                        <div className="right-profile-box" style={{ marginBottom: '20px' }}></div>
                        <ExpansionPanel
                            title="Shared file"
                        >
                            <div className="right-profile-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
                                {
                                    files.length > 0 &&
                                    files.map((file: any) => (
                                        file.type != 'image/jpeg' &&
                                        <>
                                            <div style={{ display: 'flex', gap: '10px', width: "100%" }}>
                                                <Button icon={<GrDocumentCsv />} />
                                                <span>
                                                    <h5>{file?.name}</h5>
                                                    <p style={{ fontSize: '12px' }}>24 oct 2024 - 14:32 </p>
                                                </span>
                                            </div>
                                            <Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${file.path}`} target='_blank'>
                                                <Button icon={<BiDownload />} />
                                            </Link>
                                        </>
                                    ))
                                }
                            </div>
                        </ExpansionPanel>
                        <ExpansionPanel
                            title="Photos & Media"
                        >
                            <div className="right-profile-box" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-start', width: "100%" }}>
                                {
                                    files.length > 0 &&
                                    files.map((file: any) => (
                                        file.type == 'image/jpeg' &&
                                        <div key={file._id} style={{ width: 'calc(33.33% - 10px)', marginRight: '10px', marginBottom: '10px' }}>
                                            <Image style={{ objectFit: 'cover' }} key={file._id} src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${file.path}`} alt='' height={100} />
                                        </div>
                                    ))
                                }
                            </div>

                        </ExpansionPanel>
                        <ExpansionPanel
                            title="Scheduled messages"
                        >
                            <Form layout='vertical' form={form} size='middle' onFinish={handleScheduledMessage}>
                                <Form.Item name={'content'}>
                                    <TextArea rows={4} placeholder="Click to save and send this message to a single click in future" />
                                </Form.Item>
                                <Form.Item name={'sentTime'}>
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        showTime={{ format: 'HH:mm' }}
                                        format="YYYY-MM-DD HH:mm" />
                                </Form.Item>
                                <Button type='primary' htmlType='submit' style={{ width: "100%" }}>
                                    Save Scheduled message
                                </Button>
                            </Form>
                            <List
                                className="demo-loadmore-list"
                                itemLayout="horizontal"
                                dataSource={ScheduledMessages}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[<Button type='link' key="list-loadmore-more" onClick={() => deleteScheduledMessage(item._id)}><BiTrash /></Button>]}
                                    >
                                        <List.Item.Meta
                                            title={item.content}
                                            description={dateFormat(item.sentTime, "dd/mm/yyyy, h:MM tt")}
                                        />

                                    </List.Item>
                                )}
                            />
                        </ExpansionPanel>
                        <ExpansionPanel
                            title="Bookmark message"
                        >
                            <List
                                className="demo-loadmore-list"
                                itemLayout="horizontal"
                                dataSource={messages}
                                renderItem={(item: any) => (
                                    <List.Item
                                        actions={[<Button type='link' key="list-loadmore-more" onClick={() => deleteScheduledMessage(item._id)}><BiTrash /></Button>]}
                                    >
                                        <List.Item.Meta
                                            title={item.content}
                                            description={dateFormat(item.createdAt, "dd/mm/yyyy, h:MM tt")}
                                        />

                                    </List.Item>
                                )}
                            />
                        </ExpansionPanel>
                        <ExpansionPanel
                            style={{ borderBottom: '1px solid #ccc' }}
                            title="Meeting"
                        >
                            <List
                                className="demo-loadmore-list"
                                itemLayout="horizontal"
                                dataSource={meetings}
                                renderItem={(item: any) => (
                                    <List.Item
                                        actions={[<Link key="list-loadmore-more" target='_blank' href={item.senderId === user._id ? item.startUrl : item.joinUrl}><Button type='link'><BiVideo style={{ fontSize: '22px' }} /></Button></Link>]}
                                    >
                                        <List.Item.Meta
                                            title={item.content}
                                            description={dateFormat(item.meetingStartTime, "dd/mm/yyyy, h:MM tt")}
                                        />

                                    </List.Item>
                                )}
                            />
                        </ExpansionPanel>
                        <ExpansionPanel
                            title="Todo"
                        >
                            <List
                                className="demo-loadmore-list"
                                itemLayout="horizontal"
                                dataSource={allTask}
                                renderItem={(task: any) => (
                                    <List.Item
                                        actions={[<Button type='link' key="list-loadmore-more" onClick={() => handleDelete(task._id)}><BiTrash /></Button>]}
                                    >
                                        <List.Item.Meta
                                            title={<>{task.title}  <Tag color={
                                                task.priority === 'High' ? "gold" :
                                                    task.priority === 'Medium' ? 'blue' :
                                                        task.priority === "Low" ? "green" :
                                                            task.priority === "Critical" ? "red" :
                                                                'green'
                                            }>
                                                {task.priority}
                                            </Tag></>}
                                            description={`${new Date(task.assignedDate).toLocaleDateString()} - ${new Date(task.targetDate).toLocaleDateString()}
                                            ${new Date(task.targetDate) < new Date() && (
                                                    <span style={{ color: 'red' }}> Expired</span>
                                                )}`}
                                        />

                                    </List.Item>
                                )}
                            />
                            <Button onClick={() => setIsModalVisible(true)}>Add todo</Button>
                        </ExpansionPanel>
                        <ExpansionPanel
                            title="Personal notes"
                            open={true}
                        >
                            <TextArea rows={15} value={stickyNote} onChange={(e: any) => setStickyNote(e.target.value)} onBlur={(e: any) => storeStickyNote(e.target.value)} placeholder="This is personal note for this chat. This note is visible to you only." />
                        </ExpansionPanel>
                    </div>
                </Sidebar >
            }
            <Modal footer='' title={'Edit message'} centered open={showEditMessage} onCancel={() => setShowEditMessage(false)}>
                <Form layout='vertical' onFinish={handleEditMessage}>
                    <Form.Item label="Message" name={'content'} initialValue={editMessage?.content}>
                        <Input />
                    </Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Modal>
            {
                selectedChat &&
                (!selectedChat.isGroupChat ? (
                    <>
                        <ProfileModal
                            user={getSenderFull(user, selectedChat.users)}
                            open={viewProfile}
                            setOpen={setViewProfile}
                        />
                    </>
                ) : (
                    <>
                        <UpdateGroupChatModal
                            open={viewProfile}
                            setOpen={setViewProfile}
                        />
                    </>
                ))
            }
            <CreateMeetingModal open={showCreateMeetingForm} sendMessage={sendMessage} setOpen={setShowCreateMeetingForm} />
            <CreateTodoModal
                handleCancel={handleCancel}
                eventType={eventType}
                isModalVisible={isModalVisible}
                chatId={selectedChat?._id}
                setReload={setReload}
                reload={reload}
                setIsModalVisible={setIsModalVisible}
            />
        </MainContainer >
    )
}
