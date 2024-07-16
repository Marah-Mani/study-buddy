import React, { useContext, useState } from 'react';
import { Modal, Button, Input, Form, List, Avatar, Tag, notification } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import ChatContext from '@/contexts/ChatContext';
import { User } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
const { Search } = Input;
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';
const baseURL = API_BASE_URL;
const { common } = CHAT;

interface UpdateGroupChatModalProps {
    open: any;
    setOpen: any;
}


const UpdateGroupChatModal = ({ open, setOpen }: UpdateGroupChatModalProps) => {
    const [visible, setVisible] = useState(false);
    const [groupChatName, setGroupChatName] = useState('');
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);
    const token = Cookies.get('session_token')
    const { selectedChat, setSelectedChat, user }: any = useContext(ChatContext);

    const handleSearch = async (query: any) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`${baseURL}${common.searchChat}${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            // handle error
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );

            // handle response
            setRenameLoading(false);
        } catch (error) {
            // handle error
            setRenameLoading(false);
        }
        setGroupChatName('');
    };

    const handleAddUser = async (user1: any) => {
        // handle adding user
    };

    const handleRemove = async (user1: User) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            notification.error({
                message: "Only admins can remove someone!"
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.put(
                `${baseURL}${common.groupRemove}`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setLoading(false);
        } catch (error) {
            new ErrorHandler(error)
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <Modal
                title={selectedChat.chatName}
                open={open}
                onCancel={() => setOpen(false)}
                centered
                footer={[
                    <Button key="close" onClick={() => setOpen(false)}>
                        Close
                    </Button>,
                ]}
            >
                <Form layout="inline" style={{ flexWrap: 'nowrap', justifyContent: 'space-between', width: '100%', margin: '0', padding: '0' }} size='large'>
                    <Form.Item style={{ width: '70%' }} initialValue={selectedChat.chatName}>
                        <Input
                            placeholder="Chat Name"
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item style={{ width: '30%' }}>
                        <Button
                            type="primary"
                            loading={renameLoading}
                            onClick={handleRename}
                            size='small'
                        >
                            Update
                        </Button>
                    </Form.Item>
                </Form>
                <List
                    itemLayout="horizontal"
                    dataSource={selectedChat.users}
                    renderItem={(user: User) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="remove"
                                    onClick={() => handleRemove(user)}
                                    danger
                                >
                                    Remove
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={user.image} />}
                                title={user.name}
                                description={user.email}
                            />
                            {selectedChat.groupAdmin._id === user._id && (
                                <Tag color="blue">Admin</Tag>
                            )}
                        </List.Item>
                    )}
                />
                <Search
                    placeholder="Add User to Group"
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ margin: '8px' }}
                    size='large'
                    loading={loading}
                />
                <List
                    itemLayout="horizontal"
                    dataSource={searchResult ? searchResult : []}
                    renderItem={(user: User) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="add"
                                    type="primary"
                                    onClick={() => handleAddUser(user)}
                                >
                                    Add
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={user.image} />}
                                title={user.name}
                                description={user.email}
                            />
                        </List.Item>
                    )}
                />
                <Button onClick={() => handleRemove(user)} danger>
                    Leave Group
                </Button>
            </Modal>
        </>
    );
};

export default UpdateGroupChatModal;
