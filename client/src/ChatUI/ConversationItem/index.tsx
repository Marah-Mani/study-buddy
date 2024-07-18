import React, { useContext, useState } from 'react';
import { Conversation } from '@chatscope/chat-ui-kit-react';
import Avatar from 'react-avatar';
import StringAvatar from '@/app/commonUl/StringAvatar';
import { getSender, getSenderFull } from '@/lib/chatLogics';
import { Dropdown, Menu, Popconfirm, Tooltip } from 'antd';
import {
    InfoCircleOutlined,
    VideoCameraOutlined,
    StarOutlined,
    ClearOutlined,
    DeleteOutlined,
    StopOutlined,
    UndoOutlined,
    StarFilled
} from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import Cookies from 'js-cookie';
import axios from 'axios';
import AuthContext from '@/contexts/AuthContext';
import { MdOutlineVolumeUp, MdOutlineVolumeOff } from 'react-icons/md';
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';

const baseURL = API_BASE_URL;
const { common } = CHAT;

interface ConversationItemProps {
    key: string;
    chat: any;
    selectedChat: any;
    setSelectedChat: any;
    handleSelectChat: any;
    onlineUsers: any[];
    user: any;
    handleRightClick: any;
    onReload: any;
    search: string;
    viewInfo: boolean;
    changeInfo: any
}

const ConversationItem: React.FC<ConversationItemProps> = ({
    key,
    chat,
    selectedChat,
    setSelectedChat,
    handleSelectChat,
    onlineUsers,
    user,
    handleRightClick,
    onReload,
    search = '',
    viewInfo,
    changeInfo
}) => {
    const [selectedChatId, setSelectedChatId] = useState<any>(null);
    const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
    const token = Cookies.get('session_token');
    const { setUser, chatSettings } = useContext(AuthContext);

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setSelectedChatId(chat); // Set context menu for this chat ID
        setContextMenuPosition({ top: event.clientY, left: event.clientX });
    };

    const handleCloseContextMenu = () => {
        setSelectedChatId(null); // Close context menu
    };

    const handleSelectChatWithContext = (chat: any) => {
        changeInfo(!viewInfo)
        setSelectedChat(chat);
        handleSelectChat(chat);
        handleCloseContextMenu(); // Close context menu after selecting chat
    };

    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    const handleMenuClick = async ({ key }: any) => {
        const data = {
            selectedChatId,
            key
        }
        if (key === 'information') {
            handleSelectChatWithContext(chat)
            return
        }
        if (key === 'meeting') {
            handleRightClick(data)
        }
        if (key === 'clear') {
            try {
                const { data } = await axios.get(
                    `${baseURL}${common.clearChat(selectedChatId._id)}`,
                    config
                );
                if (data) {
                    onReload();
                }
            } catch (error) {
                new ErrorHandler(error)
            }
        }
        if (key === 'delete') {
            try {
                const { data } = await axios.get(
                    `${baseURL}${common.deleteChat(selectedChatId._id)}`,
                    config
                );
                if (data) {
                    onReload();
                }
            } catch (error) {
                new ErrorHandler(error)
            }
        }
        if (key === 'favorite') {
            try {
                const { data } = await axios.put(
                    `${baseURL}${common.favoriteChat}`,
                    {
                        userId: user._id,
                        chatId: selectedChatId._id
                    },
                    config
                );
                if (data) {
                    onReload();
                }

            } catch (error) {
                new ErrorHandler(error)
            }
        } if (key === 'muteUnMute') {
            try {
                const { data } = await axios.post(
                    `${baseURL}${common.muteUnMute}`,
                    {
                        userId: user._id,
                        chatId: selectedChatId._id
                    },
                    config
                );
                if (data) {
                    onReload();
                }
            } catch (error) {
                new ErrorHandler(error)
            }
        } if (key === 'block') {
            try {
                const response = await axios.post(
                    `${baseURL}/common/chat/block`,
                    { userId: (getSenderFull(user, selectedChat.users)._id), currentLoggedInUser: user?._id },
                    config
                );
                if (response) {
                    setUser(response.data)
                }
            } catch (error) {
                new ErrorHandler(error);
            }
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            {chatSettings.showInformation &&
                <Menu.Item key='information'>
                    <InfoCircleOutlined /> Information
                </Menu.Item>
            }
            {chatSettings.showZoomCall &&
                <Menu.Item key='meeting'>
                    <VideoCameraOutlined /> Create Meeting
                </Menu.Item>
            }
            <Menu.Divider />
            {chatSettings.showFavorite &&
                chat.favourites.includes(user?._id) ?
                <Menu.Item key='favorite'>
                    <StarOutlined />  Unfavorite
                </Menu.Item>
                :
                <Menu.Item key='favorite'>
                    <StarFilled />  Favorite
                </Menu.Item>

            }
            <Menu.Item key='muteUnMute'>
                {chat?.isMute?.mute == false ? (
                    <div>
                        <MdOutlineVolumeOff style={{ fontSize: '15px' }} /> Mute
                    </div>
                ) : (
                    <div>
                        <MdOutlineVolumeUp style={{ fontSize: '15px' }} /> Unmute{chat?.isMute?.mute}
                    </div>
                )}
            </Menu.Item>
            <Menu.Divider />
            {chatSettings.allowClearChat &&
                <Popconfirm
                    title='Are you sure you want to clear this chat?'
                    onConfirm={() => handleMenuClick({ key: 'clear' })}
                >
                    <Menu.Item key='clear'>
                        <ClearOutlined /> Clear Chat
                    </Menu.Item>
                </Popconfirm>
            }
            <Menu.Item key='block'>
                {user.block.includes(getSenderFull(user, selectedChat?.users)._id) ? (
                    <>
                        <UndoOutlined /> Unblock
                    </>
                ) : (
                    <>
                        <StopOutlined /> Block
                    </>
                )}
            </Menu.Item>
            {chatSettings.allowDeleteChat &&
                <Popconfirm
                    title='Are you sure you want to delete this chat?'
                    onConfirm={() => handleMenuClick({ key: 'delete' })}
                >
                    <Menu.Item key='delete' danger>
                        <DeleteOutlined /> Delete
                    </Menu.Item>
                </Popconfirm>
            }
        </Menu>
    );

    // Filter based on search criteria
    if (search && !getSender(user, chat.users).toLowerCase().includes(search.toLowerCase()) && !chat.chatName.toLowerCase().includes(search.toLowerCase())) {
        return null;
    }

    return (
        <Dropdown
            overlay={menu}
            trigger={['contextMenu']}
            onVisibleChange={(visible) => {
                if (!visible) {
                    handleCloseContextMenu();
                }
            }}
        >
            <div
                key={key}
                onClick={() => handleSelectChatWithContext(chat)}
                onContextMenu={handleContextMenu}
                style={{ cursor: 'pointer', position: 'relative' }}
            >
                <Conversation
                    key={key}
                    onClick={() => { setSelectedChat(chat); handleSelectChat(chat) }}
                    active={selectedChat?._id === chat._id}
                    unreadCnt={!chat?.isMute?.mute && chat.unreadCount}
                    lastActivityTime={
                        <>
                            <span style={{ color: 'teal' }}>
                                {onlineUsers.some((userData: any) => userData.userId === getSenderFull(user, chat.users)._id) ? 'Online' : ''}
                                <Tooltip title={'Muted'}>
                                    <div className='textEnd'>
                                        {chat?.isMute?.mute && <MdOutlineVolumeOff style={{ fontSize: '18px', color: '#000' }} />}
                                    </div>
                                </Tooltip>
                            </span>
                        </>}
                >
                    <Conversation.Content>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                {chat.image ?
                                    <Avatar
                                        name={chat.name}
                                        src={chat.image}
                                    />
                                    :
                                    <StringAvatar
                                        email={getSender(user, chat.users).email}
                                        key={`chat-${chat._id}`}
                                        name={!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                                        user={getSenderFull(user, chat.users)}
                                    />
                                }
                            </div>
                            <div className='userName'>
                                <p
                                    style={{
                                        fontWeight: '600',
                                        textTransform: 'capitalize'
                                    }}>
                                    {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                                </p>
                                <p style={{
                                    fontSize: '12px',
                                    fontWeight: '400'
                                }}>
                                    {user.block.includes(getSenderFull(user, chat.users)._id) ?
                                        <p>You blocked this user.</p>
                                        :
                                        !chat.isGroupChat ? getSender(user, chat.users) : chat.chatName
                                    }
                                    <span dangerouslySetInnerHTML={{
                                        __html: !user.block.includes(getSenderFull(user, chat.users)._id) && chat.latestMessage &&
                                            `: ${chat.latestMessage.content.length > 50
                                                ? `${chat.latestMessage.content.substring(0, 51)}...`
                                                : chat.latestMessage.content}`
                                    }}></span>
                                </p>
                            </div>
                        </div>
                    </Conversation.Content>
                </Conversation>
                {selectedChatId === chat._id &&
                    <div
                        style={{
                            position: 'absolute',
                            top: contextMenuPosition.top,
                            left: contextMenuPosition.left,
                            zIndex: 1000,
                            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                            padding: '8px',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                        }}
                    >
                    </div>
                }
            </div>
        </Dropdown>
    );
};

export default ConversationItem;
