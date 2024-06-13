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
} from '@chatscope/chat-ui-kit-react';
import moment from 'moment-timezone';
import MyChats from '../MyChats';
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getSender, getSenderFull } from '@/lib/chatLogics';
import io from "socket.io-client";
import ErrorHandler from '@/lib/ErrorHandler';
import MessageBox from '../MessageBox';
import { Avatar, Button, DatePicker, Form, Image, Input, List, Modal, Skeleton, Tooltip, Avatar as AntdAvatar, Dropdown, MenuProps } from 'antd';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';
import { GrDocumentCsv } from 'react-icons/gr';
import { BiDownload, BiTrash } from 'react-icons/bi';
import { useFilePicker } from 'use-file-picker';
import ProfileModal from '../ProfileModal';
import UpdateGroupChatModal from '../UpdateGroupChatModal';
import { FaEllipsisV, FaInfo, FaStar, FaVideo } from 'react-icons/fa';
import TimeAgo from 'react-timeago'
import TimeZoneDisplay from '@/app/commonUl/TimeZoneDisplay';
const ENDPOINT = "http://localhost:3001"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket: any, selectedChatCompare: any;
import dateFormat from "dateformat";
import Link from 'next/link';
import StringAvatar from '@/app/commonUl/StringAvatar';

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
        fetchAgain
    }: any = useContext(ChatContext)
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
    const getListRef = () => document.querySelector("[data-message-list-container] [data-cs-message-list]");
    const token = Cookies.get('session_token')
    const [form] = Form.useForm()
    const [counter, setCounter] = useState(40);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadedMessages, setLoadedMessages] = useState([]);
    const [bookmarkMessages, setBookmarkMessages] = useState<BookmarkDataType[]>()

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

            const { data } = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/common/message/${selectedChat._id}`,
                config
            );
            if (data.length === 0) setLoadingComplete(true);
            const bookmarkMessage: any = []
            data.map((item: any) => {
                if (item.bookmark.includes(user?._id)) {
                    bookmarkMessage.push(item)
                }
            })
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
            const formData = {
                content: name ? name : newMessage,
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
                setMessages([...messages, data]); setFetchAgain(!fetchAgain)
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
        fetchMessages();
        if (selectedChat) {
            setStickyNote(selectedChat.stickyMessage?.message)
            setStickyNoteId(selectedChat.stickyMessage?._id)
        }
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        fetchMessageOnScroll();
        // eslint-disable-next-line
    }, [counter]);

    useEffect(() => {
        if (user && socketConnected) {
            socket.on("message received", (newMessageReceived: any) => {
                if (
                    !selectedChatCompare || // if chat is not selected or doesn't match current chat
                    selectedChatCompare._id !== newMessageReceived.chat._id
                ) {
                    if (!notification.includes(newMessageReceived)) {
                        setNotification([newMessageReceived, ...notification]);
                    }
                } else {
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
            label: 'Block',
            key: '2',
            onClick: () => {
                handleBlockUser();
            },
        }
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

            // if (response.data) {
            //     setMessages(undefined);
            //     setSelectedChat(undefined);
            //     setFetchAgain(!fetchAgain);
            // }
        } catch (error) {
            console.error("Error blocking user:", error);
            new ErrorHandler(error);
        }
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
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Back />
                        <ConversationHeader.Content>
                            <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <StringAvatar email={getSender(user, selectedChat.users).email} key={`chat-${selectedChat._id}`} name={selectedChat && !selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName} />
                                    <div style={{ width: '13px', height: '13px', position: 'absolute', bottom: 0, right: 0, background: 'radial-gradient(circle at 3px 3px,#00d5a6,#00a27e)', borderRadius: '50px', border: '2px solid #fff' }}></div>
                                </div>
                                <div>
                                    <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>
                                        {`${selectedChat && (selectedChat.isGroupChat ? selectedChat.chatName : getSender(user, selectedChat.users))}`}
                                    </p>
                                    <p style={{ fontSize: "12px", fontWeight: '400', color: 'rgba(0,0,0,.6)' }}>
                                        {onlineUsers.some((userData: any) => userData.userId == getSenderFull(user, selectedChat.users)._id) ? 'Online' :
                                            <TimeAgo date={getSenderFull(user, selectedChat.users)?.lastSeen} />}{' '}
                                        {!selectedChat.isGroupChat &&
                                            <span>
                                                Current time: {moment().tz(user.timeZone).format('hh:mm a')}
                                            </span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </ConversationHeader.Content>
                        <ConversationHeader.Actions>
                            <Button icon={<FaInfo />} onClick={() => setViewInfo(!viewInfo)} />&nbsp;
                            <Button icon={<FaVideo />} />&nbsp;
                            <Button icon={<FaStar color={`${selectedChat.favourites.includes(user?._id) ? '#000' : '#ccc'}`} />} onClick={handleFavourite} />&nbsp;
                            <Dropdown menu={{ items }} placement='bottomRight' trigger={['click']}>
                                <Button icon={<FaEllipsisV />} />
                            </Dropdown>
                        </ConversationHeader.Actions>
                    </ConversationHeader>
                    <MessageList
                        data-message-list-container
                        loadingMore={loadingMore}
                    //  onYReachStart={onYReachStart}
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
                    <MessageInput onAttachClick={() => openFilePicker()} onChange={typingHandler} placeholder="Type message here" onSend={() => sendMessage(null, newMessage)} />
                </ChatContainer>
            }
            {
                viewInfo &&
                <Sidebar position="right">
                    <div>
                        <div className="right-profile-box" style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                                {selectedChat &&
                                    !selectedChat?.isGroupChat ?
                                    <div style={{ position: 'relative' }}>
                                        <StringAvatar email={getSender(user, selectedChat.users).email} key={`chat-${selectedChat._id}`} name={selectedChat && !selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName} />
                                        <div style={{ width: '13px', height: '13px', position: 'absolute', bottom: 0, right: 0, background: 'radial-gradient(circle at 3px 3px,#00d5a6,#00a27e)', borderRadius: '50px', border: '2px solid #fff' }}></div>
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
                            <p><TimeZoneDisplay userTimeZone={user?.timeZone} /></p>
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
        </MainContainer >
    )
}
