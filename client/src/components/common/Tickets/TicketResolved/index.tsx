import React, { useEffect, useState } from 'react';
import './style.css'
import { Col, Image, Row } from 'antd';
import Link from 'next/link';
import TicketPageReply from '../TicketPageReply';
import { getSingleTicketData } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import ParaText from '@/app/commonUl/ParaText';

interface Props {
    resolvedTickets: any[];
    onStatusUpdate: () => void;
}

export default function TicketResolved({
    resolvedTickets,
    onStatusUpdate
}: Props) {

    const [chatBox, setChatBox] = useState(false);
    const [ticketData, setTicketData] = useState('');

    const handleTicketChat = async (ticketId: any) => {
        try {
            const res = await getSingleTicketData(ticketId);
            if (res.status === true) {
                setTicketData(res.data);
            }
            setChatBox(true);
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleUpdateFunction = () => {
        onStatusUpdate();
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2); // Simulating a 2-second loading time. You can adjust this as needed.

        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            {chatBox ? (
                <TicketPageReply
                    ticketData={ticketData}
                    onClose={() => setChatBox(false)}
                    onStatusUpdate={handleUpdateFunction}
                    handleTicketChat={(ticketId: any) => handleTicketChat(ticketId)} />
            ) : (
                <div className='tabsInbox'>
                    <ParaText size="large" color="black" fontWeightBold={600}>
                        Resolved
                    </ParaText>
                    <div className='boxInbox'>
                        {resolvedTickets?.length > 0 ? (
                            <>
                                {resolvedTickets.map((ticket: any, index: number) => (
                                    <>
                                        <div
                                            key={ticket?._id}
                                            className='ticketItem messages messagesWhite'
                                        >
                                            <div key={ticket?._id} className='ticketItem'>
                                                <div>
                                                    {loading ? (
                                                        <div>
                                                            loading
                                                        </div>
                                                    ) : (
                                                        <Row align="middle">
                                                            <Col xl={1} lg={1} md={1} sm={24} xs={24}>
                                                                <Image
                                                                    src={
                                                                        ticket?.userId?.profileImage
                                                                            ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/${ticket?.userId?.profileImage}`
                                                                            : `/images/avatar.png`
                                                                    }
                                                                    alt="profile-image"
                                                                    width={40}
                                                                    height={40}
                                                                    style={{ borderRadius: '50%' }}
                                                                    preview={false}
                                                                />
                                                            </Col>
                                                            <Col
                                                                xl={16}
                                                                lg={16}
                                                                md={16}
                                                                sm={24}
                                                                xs={24}
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleTicketChat(ticket?._id)}
                                                            >
                                                                <ParaText
                                                                    className='marginLeft dBlock'
                                                                    size="extraSmall"
                                                                    color="defaultColor"
                                                                    fontWeightBold={600}
                                                                >
                                                                </ParaText>
                                                                <ParaText
                                                                    size="extraSmall"
                                                                    color="defaultColor"
                                                                    className='marginLeft'
                                                                >
                                                                    {ticket?.description.length > 50
                                                                        ? ticket?.description.substring(0, 80) + '...'
                                                                        : ticket?.description}
                                                                </ParaText>
                                                            </Col>
                                                            <Col
                                                                className="textEnd"
                                                                xl={7}
                                                                lg={7}
                                                                md={7}
                                                                sm={24}
                                                                xs={24}
                                                            >
                                                                <ParaText size="extraSmall" color="defaultColor">
                                                                    {ticket?.createdAt && (
                                                                        <ParaText
                                                                            size="extraSmall"
                                                                            color="defaultColor"
                                                                        >
                                                                            {new Intl.DateTimeFormat('en-US', {
                                                                                hour: 'numeric',
                                                                                minute: 'numeric',
                                                                                hour12: true
                                                                            }).format(new Date(ticket.createdAt))}
                                                                        </ParaText>
                                                                    )}
                                                                </ParaText>
                                                                <ParaText
                                                                    size="extraSmall"
                                                                    color="defaultColor"
                                                                    className="dBlock"
                                                                >
                                                                    <ParaText size="extraSmall" color="defaultColor">
                                                                        <span
                                                                            style={{
                                                                                color: '#012A59',
                                                                                textTransform: 'capitalize'
                                                                            }}
                                                                        >
                                                                            Assigned
                                                                        </span>
                                                                    </ParaText>{' '}
                                                                    to :{' '}
                                                                    {ticket?.assignedTo?.fullName
                                                                        ? ticket?.assignedTo?.fullName
                                                                        : 'Not-assigned'}{' '}
                                                                    | Status :{' '}
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
                                                                </ParaText>
                                                            </Col>
                                                        </Row>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="smallTopMargin"></div>
                                    </>
                                ))}
                            </>
                        ) : (
                            <div className="textCenter">
                                <Image src="/images/dashboard/Interviews.png" alt="" />
                                <ParaText color="defaultColor" size="large" fontWeightBold={600} className="dBlock">
                                    You do not seem to have any messages. Go to <br />
                                    <ParaText size="large" color="secondaryColor" fontWeightBold={600}>
                                        <Link href={`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/ticketInbox`}>
                                            Tickets
                                        </Link>
                                    </ParaText>
                                </ParaText>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
