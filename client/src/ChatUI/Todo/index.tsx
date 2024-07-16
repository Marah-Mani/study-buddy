import ChatContext from '@/contexts/ChatContext';
import { deleteTodo, getAllTodo } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { ExpansionPanel } from '@chatscope/chat-ui-kit-react';
import { Button, List, Tag, message } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { BiTrash } from 'react-icons/bi';

export default function Todo() {
    const { user, selectedChat }: any = useContext(ChatContext);
    const [allTask, setAllTask] = useState([]);

    const handleDelete = async (taskId: string) => {
        const deleteData = {
            userId: user?._id,
            id: taskId
        }
        const res = await deleteTodo(deleteData);
        if (res.status == true) {
            message.success(res.message);
            fetchAllTask();
        } else {
            message.error(res.message);
        }
    };

    useEffect(() => {
        selectedChat && fetchAllTask();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChat]);


    const fetchAllTask = async () => {
        try {
            const response = await getAllTodo({ chatId: selectedChat._id });
            setAllTask(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

    return (
        <ExpansionPanel
            title="Todo"
        >
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={allTask}
                renderItem={(task: any) => (
                    <List.Item
                        actions={[<Button type='link' key="list-loadmore-more" onClick={() => handleDelete(task._id)}><BiTrash /></Button>]}
                    >
                        <List.Item.Meta
                            title={<>{task.title}  <Tag color={
                                task.priority === 'High' ? "gold" :
                                    task.priority === 'Medium' ? 'blue' :
                                        task.priority === "Low" ? "green" :
                                            task.priority === "Critical" ? "red" :
                                                'green'
                            }>
                                {task.priority}
                            </Tag></>}
                            description={`${new Date(task.assignedDate).toLocaleDateString()} - ${new Date(task.targetDate).toLocaleDateString()}
                                            ${new Date(task.targetDate) < new Date() && (
                                    <span style={{ color: 'red' }}> Expired</span>
                                )}`}
                        />

                    </List.Item>
                )}
            />
        </ExpansionPanel>
    )
}
