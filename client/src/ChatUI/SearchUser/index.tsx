'use client'
import React, { useContext, useEffect, useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
    Sidebar,
    Search,
    ConversationList,
    Avatar,
    Conversation
} from '@chatscope/chat-ui-kit-react';
import ChatContext from '@/contexts/ChatContext';
import axios from 'axios';
import { Drawer, notification } from 'antd';
import Cookies from 'js-cookie';
import { User } from '@/lib/types';

interface SearchUserProps {
    openDrawer: boolean;
    setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SearchUser({ openDrawer, setOpenDrawer }: SearchUserProps) {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { selectedChat, setSelectedChat, user, chats, setChats } = useContext(ChatContext);
    const token = Cookies.get('session_token')

    const fetchChats = async () => {
        // console.log(user._id);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/common/chat`, config);
            setChats(data);
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
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/common/user?search=${search}`, config);
            setLoading(false);
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
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/common/chat`, { userId }, config);

            if (!chats.find((c: any) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setOpenDrawer(false)
            setLoadingChat(false);
        } catch (error) {
            notification.error({
                message: "Error fetching the chat"
            });
        }
    };

    return (
        <Drawer placement='left' title='Search user' open={openDrawer} onClose={() => setOpenDrawer(false)}>
            <Sidebar
                position="left"
            >
                <Search
                    value={search}
                    onChange={(v) => setSearch(v)}
                    onClearClick={() => setSearch("")}
                    placeholder="Search..."
                />
                <ConversationList>
                    {searchResult.length > 0 && searchResult.map((result: User) => (
                        <Conversation
                            info="Yes i can do it for you"
                            lastSenderName="Lilly"
                            name={result.name}
                            key={result._id}
                            onClick={() => accessChat(result._id)}
                        >
                            <Avatar
                                name={result.name}
                                src={'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
                                // src={chat.image}
                                status="available"
                            />
                        </Conversation>
                    ))}
                </ConversationList>
            </Sidebar>
        </Drawer>
    )
}
