'use client'
import React, { useContext, useEffect, useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    Sidebar,
    Search,
    ConversationList,
    Conversation,
    AddUserButton
} from '@chatscope/chat-ui-kit-react';
// eslint-disable-next-line import/no-unresolved
import Avatar from 'react-avatar';
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import { Dropdown, Flex, MenuProps, notification } from 'antd';
import Cookies from 'js-cookie';
import SearchUser from '../SearchUser';
import { getSender, getSenderFull } from '@/lib/chatLogics';
import GroupChatModal from '../GroupChatModal';
import StringAvatar from '@/app/commonUl/StringAvatar';

export default function MyChats() {
    const [reload, setReload] = useState(false)
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const { chats, setChats, user, selectedChat, setSelectedChat, onlineUsers, fetchAgain, favourites, setFavourite }: any = useContext(ChatContext);
    const token = Cookies.get('session_token')
    const [openDrawer, setOpenDrawer] = useState(false)
    const [showGroupChatModal, setShowGroupChatModal] = useState(false)

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const items: MenuProps['items'] = [
        {
            label: <span onClick={() => setOpenDrawer(true)}>New chat</span>,
            key: '0',
        },
        {
            label: <span onClick={() => setShowGroupChatModal(true)}>New group</span>,
            key: '1',
        }
    ];


    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/common/chat`, config);
            // setSelectedChat(data[0])
            const favouriteChats: any = [];
            const nonFavouriteChats: any = [];

            data.map((chatData: any) => {
                if (chatData.favourites.includes(user?._id)) {
                    favouriteChats.push(chatData)
                } else {
                    nonFavouriteChats.push(chatData)
                }
            })
            setFavourite(favouriteChats);
            setChats(nonFavouriteChats);
        } catch (error) {
            notification.error({
                message: "Failed to Load the chats",
            });
        }
    };

    const handleSearch = async () => {
        if (!search) {
            // notification.info({
            //     message: "Please Enter something in search"
            // });
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/common/user?search=${search}`, config);
            setLoading(false);
            setChats(data);
        } catch (error) {
            notification.error({
                message: "Failed to Load the Search Results"
            })
        }
    };

    const handleSelectChat = async (chat: any) => {
        if (chat.unreadCount > 0) {
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
        if (user) { fetchChats() }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    useEffect(() => {
        if (user) { fetchChats() }
        // eslint-disable-next-line
    }, [reload, fetchAgain]);

    return (
        <Sidebar
            position="left"
        >
            <Flex justify='space-between'>
                <Search
                    style={{ width: '100%' }}
                    value={search}
                    onChange={(v) => setSearch(v)}
                    onClearClick={() => { setSearch(""); setReload(!reload) }}
                    placeholder="Search..."
                />
                <Dropdown trigger={['click', 'hover']} menu={{ items }} placement='bottomRight'>
                    <AddUserButton />
                </Dropdown>
            </Flex>
            <ConversationList title='Favourite'>
                {favourites.length > 0 &&
                    <Conversation
                        name='Favourite'
                    />
                }
                {favourites.length > 0 && favourites.map((chat: any) => (
                    <Conversation
                        key={chat._id}
                        onClick={() => { setSelectedChat(chat); handleSelectChat(chat) }}
                        active={selectedChat === chat}
                        unreadCnt={chat.unreadCount}
                        lastActivityTime={<span style={{ color: 'teal' }}>{onlineUsers.some((userData: any) => userData.userId == getSenderFull(user, chat.users)._id) ? 'Online' : ''}</span>}
                    >
                        <Conversation.Content>
                            <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>

                                    {
                                        chat.image ?
                                            <Avatar
                                                name={chat.name}
                                                src={chat.image}
                                            // status={onlineUsers.some((userData: any) => userData.userId == getSenderFull(user, chat.users)._id) ? 'available' : 'unavailable'}
                                            />
                                            :
                                            <StringAvatar email={getSender(user, chat.users).email} key={`chat-${chat._id}`} name={chat && !chat.isGroupChat ? getSender(user, chat.users) : chat.chatName} />
                                    }
                                    <div style={{ width: '13px', height: '13px', position: 'absolute', bottom: 0, right: 0, background: 'radial-gradient(circle at 3px 3px,#00d5a6,#00a27e)', borderRadius: '50px', border: '2px solid #fff' }}></div>
                                </div>
                                <div>
                                    <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>{!chat.isGroupChat
                                        ? getSender(user, chat.users)
                                        : chat.chatName}
                                    </p>
                                    <p style={{ fontSize: "12px", fontWeight: '400', color: 'rgba(0,0,0,.6)' }}>
                                        {!chat.isGroupChat
                                            ? getSender(user, chat.users)
                                            : chat.chatName}
                                        {chat.latestMessage && ': ' + (chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content)}
                                    </p>
                                </div>
                            </div>
                        </Conversation.Content>
                    </Conversation>
                ))}
                {chats.length > 0 &&
                    <Conversation
                        name='Chats'
                    />
                }
                {chats.length > 0 && chats.map((chat: any) => (
                    <Conversation
                        key={chat._id}
                        onClick={() => { setSelectedChat(chat); handleSelectChat(chat) }}
                        active={selectedChat === chat}
                        unreadCnt={chat.unreadCount}
                        lastActivityTime={<span style={{ color: 'teal' }}>{onlineUsers.some((userData: any) => userData.userId == getSenderFull(user, chat.users)._id) ? 'Online' : ''}</span>}
                    >
                        <Conversation.Content>
                            <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>

                                    {
                                        chat.image ?
                                            <Avatar
                                                name={chat.name}
                                                src={chat.image}
                                            // status={onlineUsers.some((userData: any) => userData.userId == getSenderFull(user, chat.users)._id) ? 'available' : 'unavailable'}
                                            />
                                            :
                                            <StringAvatar email={getSender(user, chat.users).email} key={`chat-${chat._id}`} name={chat && !chat.isGroupChat ? getSender(user, chat.users) : chat.chatName} />
                                    }
                                    <div style={{ width: '13px', height: '13px', position: 'absolute', bottom: 0, right: 0, background: 'radial-gradient(circle at 3px 3px,#00d5a6,#00a27e)', borderRadius: '50px', border: '2px solid #fff' }}></div>
                                </div>
                                <div>
                                    <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>{!chat.isGroupChat
                                        ? getSender(user, chat.users)
                                        : chat.chatName}
                                    </p>
                                    <p style={{ fontSize: "12px", fontWeight: '400', color: 'rgba(0,0,0,.6)' }}>
                                        {!chat.isGroupChat
                                            ? getSender(user, chat.users)
                                            : chat.chatName}
                                        {chat.latestMessage && ': ' + (chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content)}
                                    </p>
                                </div>
                            </div>
                        </Conversation.Content>
                    </Conversation>
                ))}
            </ConversationList>
            <SearchUser openDrawer={openDrawer} setOpenDrawer={() => setOpenDrawer(false)} />
            <GroupChatModal open={showGroupChatModal} setOpen={setShowGroupChatModal} />
        </Sidebar>
    )
}
