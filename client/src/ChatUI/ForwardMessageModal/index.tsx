import StringAvatar from '@/app/commonUl/StringAvatar';
import AuthContext from '@/contexts/AuthContext';
import { getSender, getSenderFull } from '@/lib/chatLogics';
import { Avatar, Search } from '@chatscope/chat-ui-kit-react';
import { Button, Col, Flex, notification, Row } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';
import ErrorHandler from '@/lib/ErrorHandler';

const baseURL = API_BASE_URL;
const { common } = CHAT;

interface Props {
    messages: any;
    onRefresh: any;
}

export default function ForwardMessageModal({ messages, onRefresh }: Props) {
    const token = Cookies.get('session_token');
    const { user } = useContext(AuthContext);
    const [chats, setChats] = useState<any>([]);
    const [search, setSearch] = useState<string>('');
    const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user]);

    const fetchChats = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const { data } = await axios.get(`${baseURL}${common.fetchChats}`, config);
            setChats(data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            notification.error({
                message: 'Failed to Load the chats',
            });
        }
    };

    const filteredChats = chats.filter((chatData: any) => {
        const senderName = !chatData.isGroupChat ? getSender(user, chatData.users) : chatData.chatName;
        const senderEmail = getSender(user, chatData.users).email;
        return (
            senderName?.toLowerCase().includes(search.toLowerCase()) ||
            senderEmail?.toLowerCase().includes(search.toLowerCase())
        );
    });

    const handleItem = (id: string) => {
        setSelectedChatIds((prevIds) => {
            if (prevIds.includes(id)) {
                return prevIds.filter(chatId => chatId !== id);
            } else {
                return [...prevIds, id];
            }
        });
    };

    const handleForward = async () => {
        try {
            selectedChatIds.forEach(async (chatId: string) => {
                for (const message of messages) {
                    try {
                        const config = {
                            headers: {
                                'Content-type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        };

                        const formData = {
                            content: message.content,
                            chatId: chatId,
                        };

                        const { data } = await axios.post(`${baseURL}${common.sendMessage}`, formData, config);

                    } catch (error) {
                        console.error(`Error sending message to chat ID ${chatId}:`, error);
                    }
                }
                onRefresh();
                setSelectedChatIds([]);
            });
        } catch (error) {
            notification.error({
                message: 'Failed to forward messages',
            });
        }
    };


    return (
        <>
            {loading ?
                ('')
                :
                <>
                    <Flex justify='space-between'>
                        <Search
                            style={{ width: '100%' }}
                            value={search}
                            onChange={(v) => setSearch(v)}
                            onClearClick={() => { setSearch('') }}
                            placeholder='Search...'
                        />
                    </Flex>
                    <div style={{ marginTop: '10px' }}>
                        <Row style={{
                            height: filteredChats.length > 4 ? '40vh' : 'auto',
                            overflowY: 'scroll',
                            scrollBehavior: 'smooth',
                            scrollbarColor: 'red',
                        }}>
                            {filteredChats.map((chatData: any) => (
                                <React.Fragment key={`chat-${chatData._id}`}>
                                    <Col sm={19} md={19} lg={19} xl={19} style={{ paddingTop: '15px' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <div style={{ position: 'relative' }}>
                                                {chatData.image ? (
                                                    <Avatar
                                                        name={chatData.name}
                                                        src={chatData.image}
                                                    />
                                                ) : (
                                                    <StringAvatar
                                                        email={getSender(user, chatData.users).email}
                                                        name={!chatData.isGroupChat ? getSender(user, chatData.users) : chatData.chatName}
                                                        user={getSenderFull(user, chatData.users)}
                                                    />
                                                )}
                                            </div>
                                            <div className='userName'>
                                                <p style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                                                    {!chatData.isGroupChat ? getSender(user, chatData.users) : chatData.chatName}
                                                </p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={4} md={4} lg={4} xl={4} style={{ paddingTop: '15px' }}>
                                        <Button
                                            type='primary'
                                            onClick={() => handleItem(chatData._id)}
                                        >
                                            {selectedChatIds.includes(chatData._id) ? 'Unselect' : 'Select'}
                                        </Button>
                                    </Col>

                                </React.Fragment>
                            ))}
                        </Row>
                    </div>
                    <div className='textCenter'>
                        <Button type='primary' size='large' onClick={handleForward}>
                            Forward Message
                        </Button>
                    </div>
                </>
            }
        </>
    );
}
