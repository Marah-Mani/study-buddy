"use client"

import React, { useContext, useState } from 'react';
import { Modal, Button, Input, Form, Spin, Row, Col, Tag, notification } from 'antd';
import ChatContext from '@/contexts/ChatContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import { User } from '@/lib/types';
import UserListItem from '../UserListItem';
import UserBadgeItem from '../UserBadgeItem';

interface GroupChatModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupChatModal = ({ open, setOpen }: GroupChatModalProps) => {
    const [groupChatName, setGroupChatName] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<any>([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = Cookies.get('session_token')

    const { user, chats, setChats } = useContext(ChatContext);

    const handleGroup = (userToAdd: any) => {
        if (selectedUsers.includes(userToAdd)) {
            notification.warning({ message: "User already added" });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };

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
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/common/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            notification.error({
                message: "Failed to Load the Search Results"
            });
        }
    };

    const handleDelete = (delUser: any) => {
        setSelectedUsers(selectedUsers.filter((sel: any) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            notification.warning({
                message: "Please fill all the feilds"
            });
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u: any) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            setOpen(false);
            notification.success({
                message: "New Group Chat Created!"
            });
        } catch (error) {
            notification.error({
                message: "Failed to Create the Chat!"
            });
        }
    };

    return (
        <Modal
            title="Create Group Chat"
            open={open}
            onCancel={() => setOpen(false)}
            centered
            footer={[
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    Create Chat
                </Button>,
            ]}
        >
            <Form layout="vertical">
                <Form.Item>
                    <Input
                        placeholder="Chat Name"
                        value={groupChatName}
                        onChange={(e) => setGroupChatName(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        placeholder="Add Users eg: John, Piyush, Jane"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </Form.Item>
            </Form>
            <Row gutter={[16, 16]}>
                {selectedUsers.map((u: any) => (
                    <Col key={u._id}>
                        <UserBadgeItem user={u} handleFunction={() => handleDelete(u)} />
                    </Col>
                ))}
            </Row>
            {loading ? (
                <Spin tip="Loading..." />
            ) : (
                <Row gutter={[16, 16]}>
                    {searchResult?.slice(0, 4).map((user: User) => (
                        <Col key={user._id}>
                            <UserListItem user={user} handleFunction={() => handleGroup(user)} />
                        </Col>
                    ))}
                </Row>
            )}
        </Modal>
    );
};

export default GroupChatModal;
