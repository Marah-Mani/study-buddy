import React, { useContext, useEffect, useState } from 'react'
import { Button, DatePicker, Form, Input, List } from 'antd'
import dateFormat from "dateformat";
import axios from 'axios';
import ChatContext from '@/contexts/ChatContext';
import { BiTrash } from 'react-icons/bi';
import { ExpansionPanel } from '@chatscope/chat-ui-kit-react';
const { TextArea } = Input;
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';
import ErrorHandler from '@/lib/ErrorHandler';
const baseURL = API_BASE_URL;
const { common } = CHAT;

interface DataType {
    content: string,
    sentTime: any,
    _id: string
}

interface ScheduledMessageProps {
    sendMessage: any;
    viewInfo: any;
}

export default function ScheduledMessage({ sendMessage, viewInfo }: ScheduledMessageProps) {
    const { config, selectedChat }: any = useContext(ChatContext)
    const [form] = Form.useForm()
    const [ScheduledMessages, setScheduledMessages] = useState<DataType[]>([]);
    const [reload, setReload] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                    `${baseURL}${common.scheduledMessage(selectedChat._id)}`,
                    config
                );
                setScheduledMessages(data)
                form.resetFields()
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload, selectedChat, viewInfo])

    const handleScheduledMessage = (values: any) => {
        values.createdAt = values.sentTime
        sendMessage(null, values.content, values, 'scheduled');
    }

    const deleteScheduledMessage = async (id: string) => {
        const { data } = await axios.get(
            `${baseURL}${common.deleteScheduledMessage(id)}`
        );
        setReload(!reload)
    }

    return (
        <ExpansionPanel
            title="Scheduled messages"
        >
            <Form layout='vertical' form={form} size='middle' onFinish={handleScheduledMessage}>
                <Form.Item
                    name={'content'}
                    rules={[
                        { required: true, message: 'Please enter a message' }
                    ]}
                >
                    <TextArea rows={4} placeholder="Click to save and send this message to a single click in future" />
                </Form.Item>
                <Form.Item
                    name={'sentTime'}
                    rules={[
                        { required: true, message: 'Please select a date and time' }
                    ]}
                >
                    <DatePicker
                        style={{ width: '100%' }}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm" />
                </Form.Item>
                <Button type='primary' htmlType='submit' style={{ width: "100%" }}>
                    Save Scheduled message
                </Button>
            </Form>
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={ScheduledMessages}
                renderItem={(item) => (
                    <List.Item
                        actions={[<Button type='link' key="list-loadmore-more" onClick={() => deleteScheduledMessage(item._id)}><BiTrash /></Button>]}
                    >
                        <List.Item.Meta
                            title={item.content}
                            description={dateFormat(item.sentTime, "dd/mm/yyyy, h:MM tt")}
                        />

                    </List.Item>
                )}
            />
        </ExpansionPanel>
    )
}
