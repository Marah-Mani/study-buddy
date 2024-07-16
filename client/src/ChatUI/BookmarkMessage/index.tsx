import { ExpansionPanel } from '@chatscope/chat-ui-kit-react'
import { Button, List } from 'antd'
import React from 'react'
import { BiTrash } from 'react-icons/bi';
import dateFormat from "dateformat";
import axios from 'axios';
import ErrorHandler from '@/lib/ErrorHandler';
import Cookies from 'js-cookie';
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';

const baseURL = API_BASE_URL;
const { common } = CHAT;
interface BookmarkMessageProps {
    messages: any;
    user: any;
    onReload: any;
}

export default function BookmarkMessage({ messages, user, onReload }: BookmarkMessageProps) {
    const token = Cookies.get('session_token');
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };

    const deleteScheduledMessage = async (id: string) => {
        try {
            await axios.get(
                `${baseURL}${common.bookMarkMessage(id)}`,
                config
            );
            onReload();
        } catch (error) {
            new ErrorHandler(error);
        }
    }
    return (
        <ExpansionPanel
            title="Bookmark message"
        >
            {messages.map((message: any) => {
                if (message.bookmark.includes(user._id)) {
                    return (
                        <List
                            key={message._id}
                            className="demo-loadmore-list"
                            itemLayout="horizontal"
                            dataSource={[message]}
                            renderItem={(item: any) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            type='link'
                                            key="list-loadmore-more"
                                            onClick={() => deleteScheduledMessage(item._id)}
                                        >
                                            <BiTrash />
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={(
                                            <div
                                                style={{ fontSize: '12px' }}
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            ></div>
                                        )}
                                        description={dateFormat(item.createdAt, "dd/mm/yyyy, h:MM tt")}
                                    />
                                </List.Item>
                            )}
                        />
                    );
                } else {
                    return null;
                }
            })}
        </ExpansionPanel>
    )
}
