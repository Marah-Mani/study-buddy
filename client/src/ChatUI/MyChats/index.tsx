'use client'
import React, { useContext, useEffect, useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    Sidebar,
    Search,
    ConversationList,
    AddUserButton,
    Conversation
} from '@chatscope/chat-ui-kit-react';
// eslint-disable-next-line import/no-unresolved
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import { Button, Divider, Flex, List, Modal, Tabs, TabsProps, notification } from 'antd';
import Cookies from 'js-cookie';
import SearchUser from '../SearchUser';
import GroupChatModal from '../GroupChatModal';
import ConversationItem from '../ConversationItem';
import StringAvatar from '@/app/commonUl/StringAvatar';
import { FaEllipsisVertical } from 'react-icons/fa6';
import ErrorHandler from '@/lib/ErrorHandler';
import MyAccount from '../MyAccount';
import { getSender, getSenderFull } from '@/lib/chatLogics';
import MeetingItem from '../MeetingItem';

export default function MyChats() {
    const [reload, setReload] = useState(false)
    const [search, setSearch] = useState("");
    const { chats, setChats, user, selectedChat, setSelectedChat, onlineUsers, fetchAgain, favourites, setFavourite }: any = useContext(ChatContext);
    const token = Cookies.get('session_token')
    const [showGroupChatModal, setShowGroupChatModal] = useState(false)
    const [viewProfile, setViewProfile] = useState<boolean>(false)
    const [blocks, setBlocks] = useState<any>([])
    const [meetings, setMeetings] = useState<any>([])

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const getBlockedUser = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/common/user/block/${user._id}`, config);
            setBlocks(data.data.block)
            return data;
        } catch (error) {
            notification.error({
                message: "Failed to Load the blocked users",
            });
        }
    }

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/common/chat`, config);
            setSelectedChat(selectedChat || data[0])
            const favouriteChats: any = [];
            const nonFavouriteChats: any = [];
            const allMeetings: any = [];

            data.map((chatData: any) => {
                if (chatData.meetings.length > 0) {
                    allMeetings.push(chatData)
                }
                if (selectedChat && selectedChat._id === chatData._id) {
                    setSelectedChat(chatData)
                }
                if (chatData.favourites.includes(user?._id)) {
                    favouriteChats.push(chatData)
                } else {
                    nonFavouriteChats.push(chatData)
                }
            })
            setFavourite(favouriteChats);
            setChats(nonFavouriteChats);
            setMeetings(allMeetings)
        } catch (error) {
            notification.error({
                message: "Failed to Load the chats",
            });
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
        if (user) {
            fetchChats();
            getBlockedUser();
        }
        // eslint-disable-next-line
    }, [reload, fetchAgain]);

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: "Chats",
            children: <div>
                {favourites.length > 0 &&
                    <Divider orientation='left' style={{ margin: 0 }}>Favourites</Divider>
                }
                {favourites.length > 0 && favourites.map((chat: any) => (
                    <ConversationItem
                        key={chat._id}
                        selectedChat={selectedChat}
                        chat={chat}
                        onlineUsers={onlineUsers}
                        setSelectedChat={setSelectedChat}
                        handleSelectChat={handleSelectChat}
                        user={user}
                    />
                ))}
                {chats.length > 0 &&
                    <Divider orientation='left' style={{ margin: 0 }}>Chats</Divider>
                }
                {chats.length > 0 && chats.map((chat: any) => (
                    <ConversationItem
                        key={chat._id}
                        selectedChat={selectedChat}
                        chat={chat}
                        onlineUsers={onlineUsers}
                        setSelectedChat={setSelectedChat}
                        handleSelectChat={handleSelectChat}
                        user={user}
                    />
                ))}
            </div>,
        },
        {
            key: '2',
            label: 'Contacts',
            children: <SearchUser
                setShowGroupChatModal={setShowGroupChatModal}
                showGroupChatModal={showGroupChatModal}
            // onlineUsers={onlineUsers}
            />,
        },
        {
            key: '3',
            label: 'Calls',
            children: meetings && meetings.map((chat: any) => (
                chat.meetings.map((meeting: any) => (
                    <MeetingItem
                        key={chat._id}
                        selectedChat={selectedChat}
                        chat={chat}
                        onlineUsers={onlineUsers}
                        setSelectedChat={setSelectedChat}
                        handleSelectChat={handleSelectChat}
                        user={user}
                        meeting={meeting}
                    />
                ))
            ))
        }
    ];

    const unblockUser = async (id: string) => {
        try {
            if (!id) {
                throw new Error("Sender ID not found");
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/block`,
                { userId: id },
                config
            );

            if (response.data) {
                setReload(!reload)
            }
        } catch (error) {
            console.error("Error blocking user:", error);
            new ErrorHandler(error);
        }
    };

    const accountItems: TabsProps['items'] = [
        {
            key: '1',
            label: 'My account',
            children: <MyAccount config={config} user={user} />
        },
        {
            key: '2',
            label: 'Block users',
            children: <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={blocks}
                renderItem={(item: any) => (
                    <List.Item
                        actions={[<Button type='link' key={item._id} onClick={() => unblockUser(item._id)}>Unblock</Button>]}
                    >
                        <List.Item.Meta
                            title={item.name}
                            description={item.email}
                        />

                    </List.Item>
                )}
            />
        }
    ]

    return (
        <Sidebar
            position="left"
        >
            <Flex justify='space-between' align='center' style={{ padding: '10px' }}>
                <Conversation.Content>
                    <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <StringAvatar
                                email={user.email}
                                key={`chat-${user._id}`}
                                name={user && user.name}
                                user={user}
                            />
                        </div>
                        <div>
                            <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>{user.name}
                            </p>
                            <p style={{ fontSize: "12px", fontWeight: '400', color: 'rgba(0,0,0,.6)' }}>
                                {user.email}
                            </p>
                        </div>
                    </div>
                </Conversation.Content>
                <Button type='link' onClick={() => setViewProfile(!viewProfile)}><FaEllipsisVertical /></Button>
            </Flex>
            <Flex justify='space-between'>
                <Search
                    style={{ width: '100%' }}
                    value={search}
                    onChange={(v) => setSearch(v)}
                    onClearClick={() => { setSearch(""); setReload(!reload) }}
                    placeholder="Search..."
                />
            </Flex>
            <div>
                <ConversationList>
                    <Tabs type='card' style={{ margin: 0, padding: 0 }} className='chat-tabs' defaultActiveKey="1" items={tabItems} />
                </ConversationList>
            </div>
            <GroupChatModal open={showGroupChatModal} setOpen={setShowGroupChatModal} />
            <Modal open={viewProfile} onCancel={() => setViewProfile(!viewProfile)} title='Manage Account' centered footer=''>
                <Tabs
                    tabPosition={'left'}
                    items={accountItems}
                />
            </Modal>
        </Sidebar>
    )
}
