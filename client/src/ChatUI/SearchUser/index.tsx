'use client'
import React, { useContext, useEffect, useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    Search,
    ConversationList,
    Avatar,
    Conversation
} from '@chatscope/chat-ui-kit-react';
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import { notification } from 'antd';
import Cookies from 'js-cookie';
import { User } from '@/lib/types';
import { getSenderFull } from '@/lib/chatLogics';
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';
const baseURL = API_BASE_URL;
const { common } = CHAT;

interface SearchUserProps {
    showGroupChatModal: boolean;
    setShowGroupChatModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedChat?: any;
    handleConversationClick: any;
}

export default function SearchUser({ setShowGroupChatModal, selectedChat, handleConversationClick }: SearchUserProps) {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState<any>([]);
    const { setSelectedChat, user, chats, setChats }: any = useContext(ChatContext);
    const token = Cookies.get('session_token')

    const handleSearch = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${baseURL}${common.searchChat}${search}`, config);
            setSearchResult(data);
        } catch (error) {
            notification.error({
                message: "Failed to Load the Search Results"
            })
        }
    };

    useEffect(() => {
        handleSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const accessChat = async (userId: any) => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${baseURL}${common.fetchChats}`, { userId }, config);

            if (!chats.find((c: any) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
        } catch (error) {
            notification.error({
                message: "Error fetching the chat"
            });
        }
    };

    return (
        <>
            <Search
                value={search}
                onChange={(v) => setSearch(v)}
                onClearClick={() => setSearch("")}
                placeholder="Search..."
            />
            <ConversationList>
                <Conversation
                    key={'create-group'}
                    onClick={() => setShowGroupChatModal(true)}
                >
                    <Conversation.Content style={{ display: 'block' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <Avatar
                                    name={'Create group'}
                                    src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROB8wXTaA21zUONrcL0oh-zhlNVdxqFMA5EQ&s'}
                                />
                            </div>
                            <div
                                className='userName'
                            >
                                <p style={{
                                    fontSize: '12px',
                                    fontWeight: '400'
                                }}>
                                    <p style={{ fontSize: '12px', fontWeight: '400' }}>
                                        Create group
                                    </p>
                                    Click to create a new group
                                </p>
                            </div>
                        </div>
                    </Conversation.Content>
                </Conversation>
                {searchResult.length > 0 && searchResult.map((result: User) => (
                    <Conversation
                        key={result._id}
                        onClick={() => { accessChat(result._id), handleConversationClick() }}
                        active={selectedChat && getSenderFull(user, selectedChat?.users)._id === result._id}
                    >
                        <Conversation.Content style={{ display: 'block' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <div style={{ position: 'relative' }}>
                                    <Avatar
                                        name={result.name}
                                        src={'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                                        status="available"
                                    />
                                </div>
                                <div
                                    className='userName'
                                >
                                    <p style={{
                                        fontSize: '12px',
                                        fontWeight: '400'
                                    }}>
                                        <p style={{ fontSize: '12px', fontWeight: '400' }}>
                                            {result.name}
                                        </p>
                                        {user.block.includes(result._id) ? (
                                            <p>You blocked this user.</p>
                                        ) : 'Click to a new start chat'}
                                    </p>
                                </div>
                            </div>
                        </Conversation.Content>
                    </Conversation>
                ))}
            </ConversationList>
        </>
    )
}
