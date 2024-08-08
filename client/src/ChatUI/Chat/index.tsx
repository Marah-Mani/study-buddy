'use client';
import React, { Suspense, useCallback, useContext, useEffect, useState } from 'react';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    MessageInput,
    ConversationHeader,
    TypingIndicator,
    InputToolbox,
    Search,
    Sidebar
} from '@chatscope/chat-ui-kit-react';
import moment from 'moment-timezone';
import MyChats from '../MyChats';
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import { bannedWords, getSender, getSenderFull } from '@/lib/chatLogics';
import io from 'socket.io-client';
import ErrorHandler from '@/lib/ErrorHandler';
import MessageBox from '../MessageBox';
import { TiPlus } from 'react-icons/ti';
import { Button, Form, Input, Modal, Dropdown, MenuProps, Typography, Space, Popover, Row, Col, Image, Popconfirm, Tooltip } from 'antd';
import { useFilePicker } from 'use-file-picker';
import ProfileModal from '../ProfileModal';
import UpdateGroupChatModal from '../UpdateGroupChatModal';
import { FaEllipsisV, FaInfo, FaSearch, FaStar, FaRegArrowAltCircleRight, FaVideo, FaTrash, FaArrowLeft } from 'react-icons/fa';
import TimeAgo from 'react-timeago';
var socket: any, selectedChatCompare: any;
import StringAvatar from '@/app/commonUl/StringAvatar';
import CreateMeetingModal from '@/components/CreateMeetingModal';
import TimeZoneDifference from '../TimeZoneDifference';
import { BsEmojiSmile } from 'react-icons/bs';
import CreateTodoModal from '@/components/CreateTodoModal';
import Filter from 'bad-words';
import './style.css';
import Rightbar from '../RightBar';
import AuthContext from '@/contexts/AuthContext';
import { FieldTimeOutlined } from '@ant-design/icons';
import VoiceToText from '../VoiceToText';
import ForwardMessageModal from '../ForwardMessageModal';
import { CloseOutlined } from '@ant-design/icons';
import VoiceRecorder from '../VoiceRecorder';
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';
import GetFileTypeIcon from '@/components/FileManager/commonComponents/GetFileTypeIcon';
import EmojiPicker from '../EmojiPicker';

const baseURL = API_BASE_URL;
const { common, chat } = CHAT;
export default function Chat() {
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showCreateMeetingForm, setShowCreateMeetingForm] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {
        selectedChat,
        setSelectedChat,
        setNotification,
        notification,
        setOnlineUsers,
        onlineUsers,
        setFetchAgain,
        setChats,
        chats,
        fetchAgain
    }: any = useContext(ChatContext);
    const { user, setUser } = useContext(AuthContext);
    const [prevDate, setPrevDate] = useState<any>('');
    const [prevIndex, setPrevIndex] = useState<any>();
    const [viewInfo, setViewInfo] = useState<boolean>(false);
    const [viewProfile, setViewProfile] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [editMessage, setEditMessage] = useState<any>([]);
    const [showEditMessage, setShowEditMessage] = useState<any>(false);
    const [reload, setReload] = useState(false);
    const token = Cookies.get('session_token');
    const [counter, setCounter] = useState<number>(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [eventType, setEventType] = useState('');
    const { chatSettings } = useContext(AuthContext);
    const [search, setSearch] = useState<any>('');
    const [searchInput, setSearchInput] = useState(false);
    const [enableSelect, setEnableSelect] = useState(false);
    const [idArray, setIdArray] = useState<any>([]);
    const [userModalVisible, setIsUserModalVisible] = useState(false);
    const [emoji, setEmoji] = useState(false);
    const [options, setOptions] = useState(false);
    const [meetings, setMeetings] = useState<any>([]);
    const [previewModal, setPreviewModal] = useState(false);
    const [previewFiles, setPreviewFiles] = useState<any>([]);
    const [plainFiles, setPlainFiles] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const ENDPOINT = `${process.env['NEXT_PUBLIC_SOCKET_ENDPOINT']}`;
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [sidebarStyle, setSidebarStyle] = useState({});
    const [chatContainerStyle, setChatContainerStyle] = useState({});
    const [conversationContentStyle, setConversationContentStyle] = useState({});
    const [conversationAvatarStyle, setConversationAvatarStyle] = useState({});
    const [viewChat, setViewChat] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    const handleBackClick = () => setSidebarVisible(!sidebarVisible);

    const handleConversationClick = useCallback(() => {
        if (sidebarVisible) {
            setSidebarVisible(false);
        } else {
            setViewChat(true)
        }

    }, [sidebarVisible, setSidebarVisible]);

    useEffect(() => {
        const handleResize = () => {
            setSidebarVisible(window.innerWidth <= 767);
            setIsMobile(window.innerWidth <= 767);
        };

        // Initial check
        handleResize();

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {

        if (sidebarVisible) {

            setSidebarStyle({
                display: "flex",
                flexBasis: "auto",
                width: "100%",
                maxWidth: "100%"
            });

            setConversationContentStyle({
                display: "flex"
            });

            setConversationAvatarStyle({
                marginRight: "1em"
            });

            setChatContainerStyle({
                display: "none"
            });
        } else {
            setSidebarStyle({});
            setConversationContentStyle({});
            setConversationAvatarStyle({});
            setChatContainerStyle({});
        }

    }, [sidebarVisible, setSidebarVisible, setConversationContentStyle, setConversationAvatarStyle, setSidebarStyle, setChatContainerStyle]);

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    const { openFilePicker } = useFilePicker({
        readAs: 'DataURL',
        accept: ['.json', '.pdf', '.jpg', '.jpeg', '.png'],
        multiple: false,
        onFilesSuccessfullySelected: async ({ plainFiles, filesContent }) => {
            setPreviewFiles(filesContent);
            setPlainFiles(plainFiles);
            setPreviewModal(true);
        }
    });

    const handleUpload = async () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        const formData = new FormData();
        plainFiles.forEach((file: any) => {
            formData.append('sampleFile', file);
        });

        try {
            const { data } = await axios.post(`${baseURL}${chat.upload}`, formData, config);
            sendMessage(data._id, data.name);
            setPreviewModal(false);
            setPreviewFiles([]);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const fetchMessages = async () => {
        if (!selectedChat && loadingComplete) return;
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    count: counter
                }
            };

            let { data } = await axios.get(`${baseURL}${common.fetchMessages(selectedChat._id)}`, config);
            if (data.length === 0) setLoadingComplete(true);
            const bookmarkMessage: any = [];
            const meetingData: any = [];
            data.map((item: any) => {
                if (item.bookmark.includes(user?._id)) {
                    bookmarkMessage.push(item);
                }
                if (item.meetingId !== null) {
                    meetingData.push(item);
                }
            });
            setMeetings(meetingData);
            setMessages(data);
            setLoadingMore(false);
            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            new ErrorHandler(error);
        }
    };

    const sendMessage = async (
        attachmentId: any = null,
        name: any = null,
        values: any = null,
        status: string = 'sent'
    ) => {
        socket.emit('stop typing', selectedChat._id);
        try {
            setLoading(true);
            // Prepare the configuration for the API request
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            // Regular expression to detect emojis
            const emojiRegex = /[\uD83C-\uDBFF\uDC00-\uDFFF]+/g;

            // Determine if the message contains emojis
            const containsEmoji = emojiRegex.test(newMessage);

            // Prepare the content of the message
            let content = name ? name : newMessage;
            if (!containsEmoji) {
                // Use a filter to clean the message content
                const filter = new Filter();
                filter.addWords(...bannedWords);
                content = filter.clean(content);
            }

            // Apply text formatting
            content = content.replace(/~(.*?)~/g, '<s>$1</s>');
            content = content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
            content = content.replace(/_(.*?)_/g, '<i>$1</i>');

            // Prepare the form data for the API request
            const formData = {
                content: content,
                chatId: selectedChat,
                attachmentId: attachmentId,
                status: status,
                ...values
            };

            // Make the API request to send the message
            const { data } = await axios.post(`${baseURL}${common.sendMessage}`, formData, config);

            // Emit the new message event through the socket
            socket.emit('new message', data);

            // Update the messages and chat state if the message is not scheduled
            if (data.status !== 'scheduled') {
                setMessages([...messages, data]);
                setSelectedChat({ ...selectedChat, unreadCount: 0 });
            }

            // Reload the component state
            setReload(!reload);
            setShowCreateMeetingForm(false);

            // Clear the input field after the message is successfully sent
            setNewMessage('');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            new ErrorHandler(error);
        }
    };

    useEffect(() => {
        if (user) {
            socket = io(ENDPOINT);
            socket.emit('setup', user);
            socket.on('connected', () => setSocketConnected(true));
            socket.on('new-user-add', user?._id);
            socket.on('typing', () => setIsTyping(true));
            socket.on('stop typing', () => setIsTyping(false));
            socket.emit('new-user-add', user?._id);
            socket.on('get-users', (users: any) => {
                setOnlineUsers(users);
            });
        }
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        fetchMessages();
        // eslint-disable-next-line
    }, [selectedChat]);

    const handleSelectChat = async (chat: any) => {
        if (selectedChat && chat._id == selectedChat._id) {
            await axios.put(`${baseURL}${common.chatSeen}`, { chatId: chat._id, userId: user?._id }, config);
            const updatedChats = chats.map((c: any) => {
                if (c._id === chat._id) {
                    return { ...c, unreadCount: 0 };
                }
                return c;
            });
            setChats(updatedChats);
        }
    };

    useEffect(() => {
        if (user && selectedChat && socketConnected) {
            socket.on('message received', (newMessageReceived: any) => {
                if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                    if (!notification.includes(newMessageReceived)) {
                        setNotification([newMessageReceived, ...notification]);
                    }
                } else {
                    setMessages([...messages, newMessageReceived]);
                }
                handleSelectChat(newMessageReceived.chat);
                setFetchAgain(!fetchAgain);
            });

            socket.on('message deleted', (messageDeleted: any) => {
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
            socket.emit('typing', selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    const handleEditMessage = async (values: any) => {
        socket.emit('stop typing', selectedChat._id);
        try {
            const config = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const { data } = await axios.post(
                `${baseURL}${common.sendMessage}`,
                {
                    content: values.content,
                    chatId: selectedChat,
                    messageId: editMessage._id
                },
                config
            );

            socket.emit('new message', data);
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
            setShowEditMessage(false);
        } catch (error) {
            new ErrorHandler(error);
        }
    };

    const handleDeleteForMe = async (message: any, deleteFor: any[], deleteForEveryone: boolean = false) => {
        try {
            const { data } = await axios.put(
                `${baseURL}${common.messageDelete}`,
                {
                    messageId: message._id,
                    deleteFor: deleteFor,
                    deleteForEveryone: deleteForEveryone
                },
                config
            );

            socket.emit('delete message', data);

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

    const handleFavourite = async () => {
        try {
            const { data } = await axios.put(
                `${baseURL}${common.favoriteChat}`,
                {
                    userId: user?._id,
                    chatId: selectedChat._id
                },
                config
            );
            setReload(!reload);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            new ErrorHandler(error);
        }
    };
    let items: MenuProps['items'] = [];

    if (chatSettings?.allowClearChat) {
        items.push({
            label: (
                <Popconfirm
                    title='Are you sure you want to clear this chat?'
                    onConfirm={() => handleClearChat()}
                >
                    Clear chat
                </Popconfirm>
            ),
            key: '0',
            // onClick: () => {
            //     handleClearChat();
            // }
        });
    }
    if (chatSettings?.allowDeleteChat) {
        items.push({
            label: (
                <Popconfirm
                    title='Are you sure you want to delete this chat?'
                    onConfirm={() => handleDeleteChat()}
                >
                    Delete chat
                </Popconfirm>
            ),
            key: '1',
            // onClick: () => {
            //     handleDeleteChat();
            // }
        });
    }

    items.push({
        label: selectedChat && user?.block?.includes(getSenderFull(user, selectedChat.users)._id) ? 'Unblock' : 'Block',
        key: '2',
        onClick: () => {
            handleBlockUser();
        }
    });

    items.push({
        label: selectedChat?.isMute?.mute ? 'Unmute' : 'Mute',
        key: '3',
        onClick: () => {
            handleMuteUnMute();
        }
    });

    const handleClearChat = async () => {
        try {
            const { data } = await axios.get(`${baseURL}${common.clearChat(selectedChat._id)}`, config);
            if (data) setMessages([]);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            new ErrorHandler(error);
        }
    };

    const handleDeleteChat = async () => {
        try {
            const { data } = await axios.get(`${baseURL}${common.deleteChat(selectedChat._id)}`, config);
            if (data) {
                setFetchAgain(!fetchAgain);
            }
        } catch (error) {
            new ErrorHandler(error);
        }
    };

    const handleMuteUnMute = async () => {
        try {
            const { data } = await axios.post(
                `${baseURL}${common.muteUnMute}`,
                {
                    userId: user?._id,
                    chatId: selectedChat._id
                },
                config
            );
            if (data) {
                setFetchAgain(!fetchAgain);
            }
        } catch (error) {
            new ErrorHandler(error);
        }
    };

    const handleBlockUser = async () => {
        try {
            const senderId = getSenderFull(user, selectedChat.users)._id;

            if (!senderId) {
                throw new Error('Sender ID not found');
            }

            const response = await axios.post(`${baseURL}${common.blockChat}`, { userId: senderId }, config);

            if (response) {
                setUser(response.data);
                setFetchAgain(!fetchAgain);
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            new ErrorHandler(error);
        }
    };

    const onEmojiClick = (emojiObject: any, event: any) => {
        console.log(emojiObject);
        setNewMessage((prevInput: string) => prevInput + emojiObject.emoji);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEventType('');
    };

    const handleAction = (data: any) => {
        if (data.key === 'information') {
            setViewInfo(true);
        } else if (data.key === 'meeting') {
            setShowCreateMeetingForm(true);
        }
    };

    const continueChat = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${baseURL}${common.continueChat(selectedChat._id)}`, config);

            if (response.data) {
                setFetchAgain(!fetchAgain);
                sendMessage(null, 'Request accepted.');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            console.error('Error blocking user:', error);
            new ErrorHandler(error);
        }
    };
    const handleRefresh = () => {
        setFetchAgain(!fetchAgain);
        setEnableSelect(false);
        setIsUserModalVisible(false);
        setIdArray([]);
    };

    const handleSendVoiceMessage = async (audioBlob: Blob) => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        const formData = new FormData();
        formData.append('sampleFile', audioBlob, 'voice-message.webm');

        try {
            const { data } = await axios.post(`${baseURL}${chat.upload}`, formData, config);
            sendMessage(data._id, data.name);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const handleCheckedId = (message: any, isChecked: boolean) => {
        setIdArray((prevIdArray: any[]) => {
            if (isChecked) {
                // Add the messageId if it's not already in the array
                return [...prevIdArray, message];
            } else {
                // Remove the message from the array
                return prevIdArray.filter((id) => id !== message);
            }
        });
    };

    const handleUserModal = () => {
        setIsUserModalVisible(true);
    };

    const handleDeleteMessage = () => {
        idArray.map(async (message: any) => {
            try {
                const { data } = await axios.put(
                    `${baseURL}${common.messageDelete}`,
                    {
                        messageId: message._id,
                        deleteFor: message.sender._id,
                        deleteForEveryone: false
                    },
                    config
                );

                socket.emit('delete message', data);

                setMessages((prevMessages: any) =>
                    prevMessages.map((m: any) => {
                        if (m._id === data._id) {
                            return data;
                        }
                        return m;
                    })
                );
                setFetchAgain(!fetchAgain);
                setEnableSelect(false);
                setIsUserModalVisible(false);
                setIdArray([]);
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        });
    };

    const isImage = (fileContent: string) => {
        return fileContent.startsWith('data:image/');
    };

    const handleEmojiSelect = (emoji: any) => {
        setNewMessage((prevInput: string) => prevInput + emoji);
    };

    useEffect(() => {
        const hideToolbar = () => {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual';
            }

            // Slight scroll to hide the toolbar
            setTimeout(() => {
                window.scrollTo(0, 1);
            }, 100);
        };

        hideToolbar();

        // Scroll back to top on cleanup or if necessary
        return () => {
            window.scrollTo(0, 0);
        };
    }, []);

    return (
        <div className="headerMain full-viewport-height">
            <MainContainer
                responsive
            >
                <Sidebar position="left" scrollable={false} style={sidebarStyle}>
                    <MyChats handleRightClickOption={handleAction} hardRefresh={handleRefresh} viewInfo={viewInfo} changeView={(data: any) => setViewInfo(data)} conversationClick={handleConversationClick} />
                </Sidebar>
                {selectedChat && viewChat &&
                    (
                        <ChatContainer data-message-list-container className="chatBox"
                            style={{
                                ...chatContainerStyle
                            }}
                        >
                            <ConversationHeader>
                                <ConversationHeader.Back>
                                    <Button onClick={handleBackClick} icon={<FaArrowLeft />} />
                                </ConversationHeader.Back>
                                <ConversationHeader.Content style={conversationContentStyle} >
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <div style={{ position: 'relative' }}>
                                            <StringAvatar
                                                email={getSender(user, selectedChat.users).email}
                                                key={`chat-${selectedChat._id}`}
                                                name={`${selectedChat && !selectedChat.isGroupChat
                                                    ? getSender(user, selectedChat.users)
                                                    : selectedChat.chatName
                                                    }`}
                                                user={getSenderFull(user, selectedChat.users)}
                                                conversationAvatarStyle={conversationAvatarStyle}
                                            />
                                        </div>
                                        <div className="userName">
                                            <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                                                {selectedChat && (
                                                    selectedChat.isGroupChat
                                                        ? <>
                                                            {selectedChat.chatName}
                                                            <br />
                                                        </>
                                                        : getSender(user, selectedChat.users)
                                                )}
                                                &nbsp;
                                                <span style={{ fontSize: '12px', fontWeight: '400' }}>
                                                    {onlineUsers.some(
                                                        (userData: any) =>
                                                            userData.userId == getSenderFull(user, selectedChat.users)._id
                                                    ) ? (
                                                        'Online'
                                                    ) : (
                                                        <>
                                                            Online{' '}
                                                            <TimeAgo
                                                                date={getSenderFull(user, selectedChat.users)?.lastSeen}
                                                            />
                                                        </>
                                                    )}
                                                </span>
                                            </p>
                                            <p style={{ fontSize: '12px', fontWeight: '400' }}>
                                                {user?.block?.includes(getSenderFull(user, selectedChat.users)._id) ? (
                                                    <p>You blocked this user.</p>
                                                ) : (
                                                    !selectedChat.isGroupChat && (
                                                        <span>
                                                            <FieldTimeOutlined />{' '}
                                                            {moment().tz(user?.timeZone).format('hh:mm a')}&nbsp;
                                                            {selectedChat && (
                                                                <TimeZoneDifference
                                                                    timeZone1={user?.timeZone}
                                                                    timeZone2={
                                                                        getSenderFull(user, selectedChat.users).timeZone
                                                                    }
                                                                />
                                                            )}
                                                        </span>
                                                    )
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {searchInput && (
                                        <div style={{ marginTop: '15px' }}>
                                            <Search
                                                placeholder={'Find message in current conversation'}
                                                onChange={(v) => setSearch(v)}
                                                onClearClick={() => setSearch('')}
                                            />
                                        </div>
                                    )}
                                </ConversationHeader.Content>
                                <ConversationHeader.Actions>
                                    {enableSelect ? (
                                        <>
                                            <Button
                                                icon={
                                                    <FaRegArrowAltCircleRight
                                                        color={idArray.length > 0 ? '#efa24b' : '#efa24b'}
                                                    />
                                                }
                                                onClick={idArray.length > 0 ? handleUserModal : () => { }}
                                            />
                                            &nbsp;
                                            <Button
                                                icon={<FaTrash color={idArray.length > 0 ? '#efa24b' : '#efa24b'} />}
                                                onClick={idArray.length > 0 ? handleDeleteMessage : () => { }}
                                            />
                                            &nbsp;
                                            <Button icon={<CloseOutlined />} onClick={() => setEnableSelect(false)} />
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                icon={<FaSearch />}
                                                onClick={() => {
                                                    setSearchInput(!searchInput);
                                                    setSearch('');
                                                }}
                                            />
                                            &nbsp;
                                            {chatSettings?.showInformation && (
                                                <Button icon={<FaInfo />} onClick={() => {
                                                    setViewInfo(!viewInfo)
                                                    setSidebarVisible(false)
                                                    isMobile && setViewChat(false)

                                                }} />
                                            )}
                                            &nbsp;
                                            {chatSettings?.showZoomCall && (
                                                <Button
                                                    onClick={() => {
                                                        if (selectedChat.isApproved) {
                                                            setShowCreateMeetingForm(true);
                                                        }
                                                    }}
                                                    icon={
                                                        <FaVideo color={selectedChat.isApproved ? '#efa24b' : '#efa24b'} />
                                                    }
                                                />
                                            )}
                                            &nbsp;
                                            {chatSettings.showFavorite && (
                                                <Tooltip
                                                    title={
                                                        <span>
                                                            {`${selectedChat.favourites.includes(user?._id) ? 'Remove from favorites' : 'Add to favorites'}`}
                                                        </span>
                                                    }
                                                >
                                                    <Button
                                                        icon={
                                                            <FaStar
                                                                color={`${selectedChat.favourites.includes(user?._id) ? '#efa24b' : 'rgb(255 210 158)'}`}
                                                            />
                                                        }
                                                        onClick={handleFavourite}
                                                    />
                                                </Tooltip>
                                            )}
                                            &nbsp;
                                            <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                                                <Button icon={<FaEllipsisV />} />
                                            </Dropdown>
                                        </>
                                    )}
                                </ConversationHeader.Actions>
                            </ConversationHeader>

                            <MessageList
                                loadingMore={loadingMore}
                                typingIndicator={
                                    isTyping && (
                                        <TypingIndicator
                                            content={`${getSenderFull(user, selectedChat.users).name} is typing`}
                                        />
                                    )
                                }
                            >
                                {messages &&
                                    messages.map(
                                        (m: any, i: number) =>
                                            !m.deleteFor.includes(user?._id) &&
                                            !m.deleteForEveryone && (
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
                                                    search={search}
                                                    onReload={handleRefresh}
                                                    enableSelect={enableSelect}
                                                    onEnableCheck={() => setEnableSelect(true)}
                                                    onCheckedId={handleCheckedId}
                                                />
                                            )
                                    )}
                                {selectedChat &&
                                    user &&
                                    selectedChat.createdBy !== user?._id &&
                                    !selectedChat.isApproved && (
                                        <div
                                            className="chat-not-approved"
                                            style={{ textAlign: 'center', marginTop: '35%' }}
                                        >
                                            <Typography.Paragraph>This chat is not approved.</Typography.Paragraph>
                                            <Space>
                                                <Button
                                                    loading={loading}
                                                    disabled={loading}
                                                    type="primary"
                                                    className="continue-button"
                                                    onClick={continueChat}
                                                >
                                                    Continue Message
                                                </Button>
                                                <Button className="block-button" onClick={handleBlockUser}>
                                                    Block User
                                                </Button>
                                            </Space>
                                        </div>
                                    )}
                            </MessageList>
                            <MessageInput
                                // className="chatInput"
                                onAttachClick={() => openFilePicker()}
                                onChange={typingHandler}
                                placeholder={
                                    !selectedChat.isApproved && messages.length > 0
                                        ? 'You cannot message before accept chat request.'
                                        : user?.block?.includes(getSenderFull(user, selectedChat.users)._id)
                                            ? 'You blocked this user'
                                            : 'Type message here'
                                }
                                onSend={() => !loading && sendMessage(null, newMessage)}
                                disabled={
                                    (!selectedChat.isApproved && messages.length > 0) ||
                                    user?.block?.includes(getSenderFull(user, selectedChat.users)._id) ||
                                    false
                                }
                                value={newMessage}
                                autoFocus={false}
                                sendDisabled={loading}
                            />
                            <InputToolbox>
                                <Space>
                                    <Popover
                                        content={<VoiceRecorder onSendVoiceMessage={handleSendVoiceMessage} />}
                                        trigger={selectedChat.isApproved && 'click'}
                                        open={options}
                                        onOpenChange={() => setOptions(!options)}
                                    >
                                        <TiPlus
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '23px',
                                                color: selectedChat.isApproved ? '#efa24b' : '#f9dcbb'
                                            }}
                                        />
                                    </Popover>
                                    <Popover
                                        content={
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                                            </Suspense>
                                        }
                                        trigger={selectedChat.isApproved && 'click'}
                                        open={emoji}
                                        onOpenChange={() => setEmoji(!emoji)}
                                    >
                                        <BsEmojiSmile
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '20px',
                                                color: selectedChat.isApproved ? '#efa24b' : '#f9dcbb'
                                            }}
                                        />
                                    </Popover>
                                    <VoiceToText
                                        selectedChat={selectedChat}
                                        onSetMessage={(data: any) => {
                                            typingHandler(data);
                                        }}
                                    />
                                </Space>
                            </InputToolbox>
                        </ChatContainer>
                    )}
                {viewInfo &&
                    <Rightbar
                        selectedChat={selectedChat}
                        user={user}
                        onlineUsers={onlineUsers}
                        viewInfo={viewInfo}
                        messages={messages}
                        meetings={meetings}
                        onRefresh={handleRefresh}
                        onClose={() => {
                            setViewInfo(false);
                            setSearch('');
                            setViewChat(true);
                        }}
                        sendMessage={sendMessage}
                        isMobile={isMobile}
                    />
                }
                {!selectedChat &&
                    <>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', height: '100vh', marginTop: '20%' }}>
                            <span>Select a chat to start the conversation.</span>
                        </div>
                    </>
                }
                <Modal
                    footer=""
                    title={'Edit message'}
                    centered
                    open={showEditMessage}
                    onCancel={() => setShowEditMessage(false)}
                >
                    <Form layout="vertical" onFinish={handleEditMessage}>
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
                {selectedChat &&
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
                            <UpdateGroupChatModal open={viewProfile} setOpen={setViewProfile} />
                        </>
                    ))}
                <CreateMeetingModal
                    open={showCreateMeetingForm}
                    sendMessage={sendMessage}
                    setOpen={setShowCreateMeetingForm}
                />
                <CreateTodoModal
                    handleCancel={handleCancel}
                    eventType={eventType}
                    isModalVisible={isModalVisible}
                    chatId={selectedChat?._id}
                    setReload={setReload}
                    reload={reload}
                    setIsModalVisible={setIsModalVisible}
                />
            </MainContainer>
            <Modal
                title={`Forward ${idArray.length} message`}
                centered
                open={userModalVisible}
                onCancel={() => setIsUserModalVisible(false)}
                footer={false}
            >
                <ForwardMessageModal messages={idArray} onRefresh={handleRefresh} />
            </Modal>
            <Modal
                title="Preview Files"
                open={previewModal}
                onCancel={() => {
                    setPreviewModal(false);
                    setPreviewFiles([]);
                }}
                footer={[
                    <Button key="upload" type="primary" onClick={handleUpload}>
                        Upload
                    </Button>
                ]}
                centered
                width='auto'
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Row>
                        {previewFiles.map((file: any, index: any) => (
                            <Col md={24} key={index}>
                                {isImage(file.content) ? (
                                    <Image
                                        key={index}
                                        src={file.content}
                                        alt={`file-preview-${index}`}
                                        style={{ marginBottom: '10px' }}
                                        preview={false}
                                        width={200}
                                        height={200}
                                    />
                                ) : (
                                    <GetFileTypeIcon fileType={file.type} size={200} />
                                )}
                            </Col>
                        ))}
                    </Row>
                </div>
            </Modal>
        </div>
    );
}
