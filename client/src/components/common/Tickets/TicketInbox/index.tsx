'use client';
import ParaText from '@/app/commonUl/ParaText';
import React, { useState, useContext } from 'react';
import './style.css';
import { Button, Checkbox, Col, Dropdown, Form, Popconfirm, Row, Select, Space, Tooltip, message } from 'antd';
import { deleteTicket, updateTicketStatus } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Link from 'next/link';
import { RiDeleteBin5Line } from 'react-icons/ri';

interface Props {
    tickets?: any;
    onStatusUpdate: () => void;
    onClose: () => void;
    editTicket: (ticketId: any) => void;
    onClick?: () => void; //    Add this line
    onInputChange: (value: any) => void;
}

export default function TicketInbox({ tickets, onClose, onStatusUpdate, editTicket, onClick, onInputChange }: Props) {
    const { user } = useContext(AuthContext);
    const [selectedTickets, setSelectedTickets] = useState<any[]>([]);
    const [selectedTicketStatus, setSelectedTicketStatus] = useState('all')



    const handleEditOptionClick = (ticketId: string) => {
        editTicket(ticketId);
    };

    const handleDeleteOptionClick = async (id: any) => {
        try {
            // const data = {
            //     id: id,
            //     userId: user?._id
            // };
            const res = await deleteTicket([id]);
            if (res.status === true) {
                onClose();
                message.success(res.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleConfirm = async (ticketId: any) => {
        try {
            const data = {
                ticketId: ticketId,
                status: 'resolved',
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

    const handleCheckboxChange = (ticketId: any) => {
        setSelectedTickets((prevSelectedTickets) => {
            if (prevSelectedTickets.includes(ticketId)) {
                return prevSelectedTickets.filter((id) => id !== ticketId);
            } else {
                return [...prevSelectedTickets, ticketId];
            }
        });
    };

    const SelectAll = () => {
        if (selectedTickets.length === tickets.length) {
            setSelectedTickets([]);
        } else {
            setSelectedTickets(tickets.map((ticket: any) => ticket._id));
        }
    };

    const allConfirmDelete = async () => {
        const res = await deleteTicket(selectedTickets)
        onClose()
        message.success(res.message);
        setSelectedTickets([])


    }

    const handleChange = (value: any) => {
        onInputChange(value)
    };

    return (
        <>
            <div className="boxInbox">
                <Row gutter={[16, 16]} align='middle'>
                    <Col xs={24} sm={3} md={3} lg={3} xl={3} xxl={3}>
                        <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                            Tickets
                        </ParaText>
                    </Col>
                    <Col xs={24} sm={21} md={21} lg={21} xl={20} xxl={20}>
                        <Row justify='end' gutter={[16, 16]}>
                            <Col xs={24} sm={8} md={3} lg={3} xl={3} xxl={4} className="textEnd">
                                {selectedTickets.length > 0 && <Popconfirm
                                    style={{ height: '35px' }}
                                    title="Are you sure to delete selected ticket?"
                                    onConfirm={() => allConfirmDelete()}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        className="primary"
                                        danger
                                        ghost
                                        style={{
                                            height: '35px',
                                            color: '#b90d0d',
                                            background: '#af03031f'
                                        }}
                                    >
                                        <RiDeleteBin5Line style={{ fontSize: '15px' }} />
                                        Delete
                                    </Button>
                                </Popconfirm>}
                            </Col>
                            <Col xs={24} sm={12} md={4} lg={4} xl={4} xxl={4}>
                                {/* <Form>
                                    <Form.Item name="search" label="">
                                        <Select
                                            placeholder="Search by status"
                                            style={{ width: '100%', height: '35px' }}
                                            value={selectedTicketStatus}
                                            onChange={handleChange}
                                        >
                                            <Select.Option key="resolved" value="resolved">Resolved</Select.Option>
                                            <Select.Option key="open" value="open">Open</Select.Option>
                                            <Select.Option key="all" value="all">All</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Form> */}
                            </Col>
                            <Col xs={24} sm={4} md={3} lg={3} xl={3} xxl={3} className="textEnd">
                                <Button type="primary" ghost onClick={onClick} style={{ height: '35px' }}>
                                    Add Ticket
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {/* <div className="largeTopMargin"></div> */}
                <Checkbox
                    style={{ marginLeft: '10px' }}
                    onChange={() => SelectAll()} // Call SelectAll when checkbox is clicked
                    checked={selectedTickets.length === tickets.length && selectedTickets.length !== 0} // Check if all tickets are selected and some tickets are selected
                />
                <Tooltip title="Tap to chat">
                    {tickets.map((ticket: any, index: number) => (
                        <div key={ticket._id} className="ticketItem messages messagesWhite">
                            <div key={ticket?._id} className="ticketItem">
                                <div>
                                    <Row align="middle" gutter={10}>
                                        <Col
                                            xl={1}
                                            lg={1}
                                            md={1}
                                            sm={24}
                                            xs={24}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <>
                                                <Checkbox
                                                    checked={selectedTickets.includes(ticket._id)}
                                                    onChange={() => handleCheckboxChange(ticket._id)}
                                                />
                                            </>
                                        </Col>
                                        <Col
                                            xl={16}
                                            lg={16}
                                            md={16}
                                            sm={24}
                                            xs={24}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {user?.role == 'admin' ? (
                                                <Link href={`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/tickets/${ticket._id}`}>
                                                    <div>
                                                        <ParaText
                                                            className="dBlock"
                                                            size="extraSmall"
                                                            color={'defaultColor'}
                                                            fontWeightBold={600}
                                                            style={{ paddingLeft: '10px' }}
                                                        ></ParaText>
                                                        <ParaText size="extraSmall" color="defaultColor">
                                                            {ticket?.description.length > 50
                                                                ? ticket?.description.substring(0, 80) + '...'
                                                                : ticket?.description}
                                                        </ParaText>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <Link href={`${process.env['NEXT_PUBLIC_SITE_URL']}/user/tickets/${ticket._id}`}>
                                                    <div>
                                                        <ParaText
                                                            className="dBlock"
                                                            size="extraSmall"
                                                            color={'defaultColor'}
                                                            fontWeightBold={600}
                                                            style={{ paddingLeft: '10px' }}
                                                        ></ParaText>
                                                        <ParaText size="extraSmall" color="defaultColor">
                                                            {ticket?.description.length > 50
                                                                ? ticket?.description.substring(0, 80) + '...'
                                                                : ticket?.description}
                                                        </ParaText>
                                                    </div>
                                                </Link>
                                            )}
                                        </Col>
                                        <Col className="textEnd" xl={7} lg={7} md={7} sm={24} xs={24}>
                                            <ParaText size="extraSmall" color="defaultColor">
                                                {ticket?.createdAt && (
                                                    <ParaText size="extraSmall" color="defaultColor">
                                                        {new Intl.DateTimeFormat('en-US', {
                                                            hour: 'numeric',
                                                            minute: 'numeric',
                                                            hour12: true
                                                        }).format(new Date(ticket.createdAt))}
                                                    </ParaText>
                                                )}
                                            </ParaText>

                                            {user?.role == 'admin' ? (
                                                <ParaText size="extraSmall" color="defaultColor" className="dBlock">
                                                    <ParaText size="extraSmall" color="defaultColor">
                                                        <span
                                                            style={{
                                                                color: '#012A59',
                                                                textTransform: 'capitalize'
                                                            }}
                                                        >
                                                            Assign
                                                        </span>
                                                    </ParaText>{' '}
                                                    to :{' '}
                                                    {ticket?.assignee?.name ? ticket?.assignee?.name : 'Not-assigned'} | Status :{' '}
                                                    <ParaText size="extraSmall">
                                                        {' '}
                                                        <span
                                                            style={{
                                                                color: '#0091F7',
                                                                textTransform: 'capitalize'
                                                            }}
                                                        >
                                                            {ticket?.status}
                                                        </span>{' '}
                                                    </ParaText>
                                                    <ParaText size="extraSmall">
                                                        <span>
                                                            <Dropdown
                                                                menu={{
                                                                    items: [
                                                                        {
                                                                            label: <span>Edit</span>,
                                                                            key: '0',
                                                                            onClick: () =>
                                                                                handleEditOptionClick(ticket._id)
                                                                        },
                                                                        {
                                                                            label: (
                                                                                <span>
                                                                                    <Popconfirm
                                                                                        title="Delete ticket"
                                                                                        description="Are you sure to delete this ticket?"
                                                                                        onConfirm={async () =>
                                                                                            handleDeleteOptionClick(
                                                                                                ticket._id
                                                                                            )
                                                                                        }
                                                                                        okText="Yes"
                                                                                        cancelText="No"
                                                                                    >
                                                                                        Delete
                                                                                    </Popconfirm>
                                                                                </span>
                                                                            ),
                                                                            key: '1'
                                                                        },
                                                                        {
                                                                            label: (
                                                                                <span>
                                                                                    <Popconfirm
                                                                                        title="Change status"
                                                                                        description="Are you sure to resolved this ticket?"
                                                                                        onConfirm={async () =>
                                                                                            handleConfirm(
                                                                                                ticket._id
                                                                                            )
                                                                                        }
                                                                                        okText="Yes"
                                                                                        cancelText="No"
                                                                                    >
                                                                                        <span className="completeStatus">
                                                                                            Mark Complete
                                                                                        </span>
                                                                                    </Popconfirm>
                                                                                </span>
                                                                            ),
                                                                            key: '1'
                                                                        }
                                                                    ]
                                                                }}
                                                                trigger={['click']}
                                                            >
                                                                <a
                                                                    onClick={(e) => e.preventDefault()}
                                                                    className="align"
                                                                >
                                                                    <Space>
                                                                        <ParaText
                                                                            size="extraSmall"
                                                                            color="SecondaryColor"
                                                                            className="weight700"
                                                                        >
                                                                            <BsThreeDotsVertical />
                                                                        </ParaText>
                                                                    </Space>
                                                                </a>
                                                            </Dropdown>
                                                        </span>
                                                    </ParaText>
                                                </ParaText>
                                            ) : (
                                                <ParaText size="extraSmall" color="defaultColor" className="dBlock">
                                                    {' '}
                                                    <div style={{ padding: '10px' }}></div>
                                                </ParaText>
                                            )}
                                        </Col>
                                    </Row>

                                </div>
                            </div>
                        </div>
                    ))}
                </Tooltip>

            </div >
        </>
    )
}


