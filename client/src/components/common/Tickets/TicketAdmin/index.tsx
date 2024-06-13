"use client"
import React, { useState, useContext, useEffect } from 'react';
import { Button, Checkbox, Col, Dropdown, Form, Popconfirm, Row, Select, Space, Tooltip, message, Table, Input, } from 'antd';
import { deleteTicket, updateTicketStatus } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import './style.css';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;
import { getAllTickets } from '@/lib/commonApi';
import Link from 'next/link';
import ParaText from '@/app/commonUl/ParaText';
interface Props {
    tickets?: any;
    onStatusUpdate: () => void;
    onClose: () => void;
    editTicket: (ticketId: any) => void;
    onClick?: () => void;
    onInputChange: (value: any) => void;
}

export default function TicketAdmin({ tickets, onClose, onStatusUpdate, editTicket, onClick, onInputChange }: Props) {
    const { user } = useContext(AuthContext);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [messages, setMessage] = useState('Please select atleast one to delete');
    const [selectedTicketId, setSelectedTicketId] = useState<string[]>([]);
    const [searchQuery, setsearchQuery] = useState<string>("");
    const [filterdata, setfilterdata] = useState([]);

    const Handleserach = (e: any) => {
        setsearchQuery(e.target.value)

    };

    useEffect(() => {
        const getData = () => {
            const filteredData = tickets.filter((ticket: any) =>
                ticket.creator.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setfilterdata(filteredData);
        }
        getData()
    }, [searchQuery, tickets]);



    const handleStatusChange = async (value: string, record: any) => {
        try {
            const data = {
                ticketId: record._id,
                status: value,
                userId: user?._id
            };
            const res = await updateTicketStatus(data);
            if (res.status === true) {
                onStatusUpdate();
                message.success(res.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const ticketsWithKeys = filterdata.map((ticket: any, index: any) => ({
        ...ticket,
        key: ticket._id,
    }));

    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            if (selectedRowKeys) {
                setSelectedRowKeys(selectedRowKeys);
                setMessage('Are you sure you want to delete this ticket?');
            } else {
                setMessage('');
            }
            setSelectedTicketId(selectedRowKeys);
        }
    };

    const confirmDelete = async () => {
        const response = await deleteTicket(selectedTicketId);
        if (response) {
            getAllTickets();
            setSelectedRowKeys([])
        }
    }


    const handleChatButtonClick = async (record: any) => {
        try {
            await handleStatusChange('in_progress', record);
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: any) => <p>{record?.creator?.name}</p>
        },

        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: "30",
            render: (text: any, record: any) => <p>{record?.creator.email}</p>
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text: any, record: any) => (
                <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/admin/tickets/${record._id}`}>
                    <Button
                        disabled={record.status === 'resolved'}
                        onClick={() => handleChatButtonClick(record)}
                    >
                        <EditOutlined /> Chat
                    </Button>
                </Link>
            ),

        },
        {
            title: 'Status',
            key: 'status',
            render: (text: any, record: any) => (
                <Select defaultValue={record.status} style={{ width: 120 }} onChange={(value) => handleStatusChange(value, record)}>
                    <Option value="open" style={{ background: 'none' }}>Open</Option>
                    <Option value="in_progress" ><p style={{ background: "yellow" }}>In Progress</p></Option>
                    <Option value="resolved"><p style={{ background: "green" }}>Resolved</p></Option>
                </Select>

            ),
        },
    ];


    return (
        <>
            <Row>
                <Col md={12}>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        Tickets
                    </ParaText>
                </Col>

                <Col md={10} className={'textEnd'} style={{ display: "flex" }}>
                    <Input type='search' placeholder='search' onChange={Handleserach} value={searchQuery} />

                </Col>
            </Row >
            {
                selectedRowKeys.length > 0 && <Popconfirm
                    style={{ height: '40px' }}
                    title="Are you sure to delete selected Ticket?"
                    onConfirm={confirmDelete}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        danger
                        ghost>
                        Delete
                    </Button>
                </Popconfirm>
            }
            < Table
                dataSource={ticketsWithKeys}
                columns={columns}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection
                }
                }
                pagination={{
                    defaultPageSize: 100
                }}
            />
        </>
    );
}
