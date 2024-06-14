'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Divider, Image, Popconfirm, Row, Select, UploadFile, Upload, message } from 'antd';
import { IoArrowBackOutline } from 'react-icons/io5';
import { Input } from 'antd';
import { Form } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import SecondaryButton from '@/app/commonUl/SecondaryButton';
import ParaText from '@/app/commonUl/ParaText';
import './style.css';
import { PlusOutlined } from '@ant-design/icons';
import { assignTicket, updateTicketStatus, getAllUserData, addChatDetails, getChatDetail } from '@/lib/commonApi';
import OpenModal from '@/app/commonUl/OpenModal';
import { handleFileCompression } from '@/lib/commonServices';
import ImageWithFallback from '@/components/ImageWithFallback';
const { TextArea } = Input;
import { useRouter } from 'next/navigation';
import TableData from '@/app/commonUl/tableData';
import { usePathname } from '@/navigation';
interface Props {
    ticketData: any;
    onClose?: () => void;
    onStatusUpdate?: () => void;
    handleTicketChat: (ticketId?: any) => void;
}

export default function TicketPageReply({ onClose, ticketData, onStatusUpdate, handleTicketChat }: Props) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
    const { user } = useContext(AuthContext);
    const [ticketId, setTicketId] = useState('');
    const [chatData, setChatData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [assignModal, setAssignModal] = useState(false);
    const [userName, setUserName] = useState('');
    const [users, setAllUsers] = useState<any[]>([]);
    const [assigneUserId, setAssigneUserId] = useState('');
    const [validationError, setValidationError] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const currentPath = usePathname();

    const backUrl = () => {
        if (currentPath.startsWith("/admin")) {
            router.push("/en/admin/tickets");
        } else if (currentPath.startsWith("/user")) {
            router.push("/en/user/tickets");
        } else {
        }
    }

    console.log(currentPath);

    useEffect(() => {
        if (ticketData) {
            setTicketId(ticketData?._id);
            fetchAllUsers();
        }
    }, []);

    useEffect(() => {
        if (ticketId) {
            fetchChatDetails(ticketId);
        }
    }, [ticketId]);

    const fetchAllUsers = async () => {
        try {
            const res = await getAllUserData();
            if (res.status === true) {
                setAllUsers(res.users);
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
                const completeStatus = document.querySelector('.completeStatus') as any;
                if (completeStatus) {
                    completeStatus.innerText = 'Completed';
                }
                // onStatusUpdate();
                message.success(res.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleClose = () => {
        setAssignModal(false);
    };

    const hotelOptions = users.map((user) => ({
        value: user._id,
        label: user.name
    }));

    const onChange = (value: string, option: { label: string; value: string; } | { label: string; value: string; }[]) => {
        if (Array.isArray(option)) {
            const firstOption = option[0];
            if (firstOption) {
                setUserName(firstOption.label);
                setAssigneUserId(firstOption.value);
            } else {
                setUserName('');
                setAssigneUserId('');
            }
        } else {
            setUserName(option.label);
            setAssigneUserId(option.value);
        }
    };

    const handleAssignUser = async () => {
        setLoading(true);
        const data = {
            ticketId: ticketId,
            userId: user?._id,
            assigneUserId: assigneUserId,
        };
        const res = await assignTicket(data);
        if (res.status === true) {
            const assignButton = document.querySelector('.assignButton') as any;
            if (assignButton) {
                assignButton.innerText = `Assigned to - ${userName}`;
            }
            handleTicketChat(ticketId);
            // onStatusUpdate();
            setAssignModal(false);
            setLoading(false);
            message.success(res.message);
        }
    };

    const handleAssign = () => {
        if (ticketData?.assignee?.name) {
            form.setFieldsValue({
                assigneUserId: ticketData?.assignee?._id
            });
        }
        setAssignModal(true);
    };

    const fetchChatDetails = async (ticketId: any) => {
        try {
            const res = await getChatDetail(ticketId);
            if (res.status === true) {
                setChatData(res.data);


            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const formData = new FormData();
            if (fileList.length > 0) {
                formData.append('image', fileList[0]?.originFileObj as Blob);
            }
            formData.append('ticketId', (ticketId as string) || '');
            formData.append('userId', (user?._id as string) || '');
            formData.append('senderId', (user?._id as string) || '');
            formData.append('message', (values.message as string) || '');

            // Check if either image or message is present
            if (fileList.length > 0 || (values.message).trim() !== '') {
                const res = await addChatDetails(formData);

                if (res.status === true) {
                    fetchChatDetails(ticketId);
                    form.resetFields();
                    setFileList([]);
                }
            } else {
                // Display a message prompting the user to enter a message
                console.log("Please enter a message.");
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };



    useEffect(() => {
        chatEndRef.current?.scrollIntoView();
    }, [chatData]);


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );



    const handleRemove = () => {
        setFileList([]);
    }

    const handleBeforeUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFileList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };



    return (

        <div className="tabsInbox">
            <div className="largeTopMargin"></div>
            <div className='topBarFixed'>
                <Row align="middle">

                    <Col xs={20} sm={20} md={12} lg={16} xl={16} xxl={16}>
                        <div className='centerAndMobile'>
                            <ParaText size="large" color="defaultColor">
                                {ticketData?.title.length > 50
                                    ? ticketData?.title.substring(0, 50) + '...'
                                    : ticketData?.title}
                            </ParaText>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={6} xl={6} xxl={6}>
                        {ticketData?.status === 'resolved' ? (
                            ''
                        ) : (
                            <Row gutter={[16, 16]} align={'middle'} justify='end'>
                                {/* <Col xs={6} sm={6} md={12} lg={12} xl={12} xxl={12}>
                                    <ParaText size="small" color="defaultColor">
                                        {user?.role == 'admin' ? (
                                            <span onClick={handleAssign}>
                                                <Button danger className="assignButton" style={{ width: '100%', height: '40px' }}>
                                                    {ticketData?.assignee?.name ? `Assigned to - ${ticketData?.assignee?.name}` : 'Assign'}
                                                </Button>
                                            </span>
                                        ) : (
                                            <span >
                                                <Button danger className="assignButton" style={{ width: '100%', height: '40px' }}>
                                                    {ticketData?.assignee?.name ? `Assigned to - ${ticketData?.assignee?.name}` : 'Assign'}
                                                </Button>
                                            </span>
                                        )}
                                    </ParaText>
                                </Col>
                                <Col xs={10} sm={10} md={12} lg={12} xl={12} xxl={12} >
                                    {user?.role == 'admin' ? (
                                        <Popconfirm
                                            title="Change status"
                                            description="Are you sure to resolve this ticket?"
                                            onConfirm={async () => handleConfirm(ticketId)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button danger className="completeStatus" style={{ width: '100%', height: '40px' }}>Mark Complete</Button>
                                        </Popconfirm>
                                    ) : (
                                        <Button danger style={{ width: '100%', height: '40px' }} className="completeStatus">{ticketData?.status}</Button>

                                    )}
                                </Col> */}
                            </Row>
                        )}
                    </Col>
                </Row>
                {/* <div className="ticketreplychat">
                    <Row align="middle">
                        <Col xl={21} lg={21} md={1} sm={24} xs={24}>
                            <ParaText size="extraSmall" color="defaultColor">
                                {ticketData?.description}
                            </ParaText>
                        </Col>
                        <Col xl={3} lg={3} md={3} sm={24} xs={24}>
                            <ParaText size="extraSmall" color="defaultColor">
                                {ticketData?.createdAt && (
                                    <span>
                                        {new Intl.DateTimeFormat('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        })
                                            .format(new Date(ticketData.createdAt))
                                            .replace('at', ',')}
                                    </span>
                                )}
                            </ParaText>
                        </Col>
                    </Row>
                </div> */}
            </div>
            <Divider style={{ backgroundColor: '#CFE5FF' }} />
            <div className="largeTopMargin"></div>
            <div className="boxInbox">
                <div className="largeTopMargin"></div>
                <div className="messagesWhite">
                    {Array.isArray(chatData) &&
                        chatData.map((chat, index) => (
                            <div key={index}
                                className={`massageFiled ${chat.senderId._id === user?._id ? 'chat-right' : 'chat-left'}`}
                            >
                                <div className='dFlex'>
                                    <div>
                                        <Image
                                            width={25}
                                            height={25}
                                            style={{ borderRadius: '40px' }}
                                            src={
                                                chat?.senderId.profileImage
                                                    ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/${chat?.senderId.profileImage}`
                                                    : `/images/avatar.png`
                                            }
                                            alt="Avatar"
                                        />
                                    </div>
                                    <div>
                                        <ParaText
                                            className="dBlock"
                                            size="smallExtra"
                                            color="PrimaryColor"
                                            fontWeightBold={500}
                                        >
                                            {chat?.userId?.name != null ? chat?.userId?.name : chat?.userId?.name} ({chat?.userId?.role})
                                        </ParaText>
                                    </div>
                                    <div>
                                        <ParaText size="extraSmall" color="black">
                                            {chat?.createdAt && (
                                                <span style={{ fontSize: '12px' }}>
                                                    {new Intl.DateTimeFormat('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true
                                                    })
                                                        .format(new Date(chat?.createdAt))
                                                        .replace('at', ',')}
                                                </span>
                                            )}
                                        </ParaText>
                                    </div>
                                </div>

                                <ParaText size="extraSmall" color="black" className={'dBlock marLeftChat'}>
                                    {chat?.message}

                                </ParaText>

                                {chat.image && (
                                    <Row>
                                        <Col xl={20} lg={20} md={20} sm={24} xs={24}>
                                            <ImageWithFallback
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/ticketchat/original/${chat.image}`}
                                                alt="not found"
                                                style={{ width: '100%', height: '200px' }} fallbackSrc={chat.image} shouldPreview={false} />

                                        </Col>
                                    </Row>
                                )}

                            </div>
                        ))}
                    <div ref={chatEndRef}></div>
                </div>

                {ticketData?.status === 'resolved' ? (
                    ''
                ) : (
                    <div className="centerSideButtonBottom fixedBottom">
                        <Form form={form} onFinish={handleSubmit}>
                            <Row gutter={16} align='middle'>
                                <Col xs={24} sm={24} md={2} lg={2} xl={2} xxl={2} className="gapBottom" >
                                    <div className="uploadFixed">
                                        <Form.Item name="image">
                                            <Upload
                                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                                listType="picture-card"
                                                fileList={fileList}
                                                // onChange={handleChange}
                                                onRemove={handleRemove}
                                                beforeUpload={handleBeforeUpload}
                                                accept=".jpg,.jpeg,.png"
                                            >
                                                {fileList.length >= 1 ? null : uploadButton}
                                            </Upload>
                                        </Form.Item>
                                    </div>
                                </Col>
                                <Col lg={17} md={17} sm={24} xs={24} className="gapBottom">
                                    <Form.Item
                                        name="message"
                                        rules={[
                                            {

                                                message: 'Please enter a message'
                                            }
                                        ]}
                                    >
                                        <TextArea rows={3} placeholder="Your message goes here..." />
                                    </Form.Item>
                                </Col>
                                <Col lg={3} md={3} sm={12} xs={12} className='set-send-btn'>
                                    <SecondaryButton label="Send Message" htmlType="submit" />
                                    <SecondaryButton label="cancel" onClick={backUrl} />

                                </Col>
                            </Row>
                        </Form>
                    </div>
                )}
            </div>
            <OpenModal title={<span style={{ fontSize: '20px' }}> Select person to assign</span>} width={440} open={assignModal} onClose={handleClose}>
                <div className="largeTopMargin"></div>
                <Row gutter={24}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <Form form={form} layout='vertical'>
                            <Form.Item
                                label="Users"
                                name="assigneUserId"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select user'
                                    }
                                ]}
                                style={{ fontSize: '18px', cursor: 'pointer' }}>
                                <Select
                                    showSearch
                                    placeholder="Select user name"
                                    optionFilterProp="children"
                                    onChange={onChange}
                                    options={hotelOptions}
                                    style={{ minHeight: '34px', cursor: 'pointer' }}
                                />
                            </Form.Item>
                        </Form>
                        <div className="largeTopMargin"></div>
                        <div className="textCenter">
                            <SecondaryButton
                                label={loading ? 'Please wait' : 'Assign Ticket'}
                                loading={loading}
                                width="170px"
                                onClick={handleAssignUser}
                            />
                        </div>
                    </Col>
                </Row>
            </OpenModal>
        </div >

    )
}
