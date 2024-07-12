import React, { useContext, useEffect, useState } from 'react';
import styles from './style.module.css';
import ErrorHandler from '@/lib/ErrorHandler';
import { deleteAllMessages, deleteMessage, getUserNotification, updateAllReadStatus, updateReadStatus } from '@/lib/commonApi';
import { useRouter } from 'next/navigation';
import { Col, Row, Image, Pagination, Button, message, Popconfirm, Avatar, Tag } from 'antd';
import AuthContext from '@/contexts/AuthContext';
import { IoNotificationsOffOutline } from 'react-icons/io5';
import ParaText from '@/app/commonUl/ParaText';
import { DeleteOutlined } from '@ant-design/icons';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function TabsInbox() {
	const { user } = useContext(AuthContext);
	const [notificationData, setNotificationData] = useState<any[]>([]);
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentNotification = notificationData.slice(indexOfFirstItem, indexOfLastItem);

	const fetchAllNotifications = async () => {
		try {
			const res = await getUserNotification(user?._id);
			if (res.status === true) {
				setNotificationData(res.data);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	useEffect(() => {
		if (user) {
			fetchAllNotifications();
			handleMarkAsRead();
		}
	}, [user]);

	// const handleNavigation = async (notification: any) => {
	// 	try {
	// 		const data = {
	// 			id: notification._id,
	// 			isRead: 'yes'
	// 		};
	// 		const res = await updateReadStatus(data);
	// 		if (res.success == true) {
	// 			router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/${notification.url}`);
	// 		}
	// 	} catch (error) {
	// 		ErrorHandler.showNotification(error);
	// 	}
	// };
	const handleNavigation = async (notification: any) => {
		router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/${notification.url}`);
	};

	const handleChangePage = (page: number) => {
		setCurrentPage(page);
	};

	const handleMarkAsRead = async () => {
		try {
			const data = {
				userId: user?._id,
				isRead: 'yes'
			};
			const res = await updateAllReadStatus(data);
			if (res.success == true) {
				fetchAllNotifications();
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const handleDeleteAll = async () => {
		try {
			const data = {
				userId: user?._id,
			};
			const res = await deleteAllMessages(data);
			if (res.success == true) {
				message.success(res.message);
				fetchAllNotifications();
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	const handleDelete = async (id: string) => {
		try {
			const data = {
				userId: user?._id,
				notificationId: id
			};
			const res = await deleteMessage(data);
			if (res.success == true) {
				message.success(res.message);
				fetchAllNotifications();
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	}

	return (
		<>
			<div className="smallTopMargin"></div>
			<div className=''>
				<Row>
					<Col xl={9} lg={9} md={9} sm={24} xs={24}>
						<ParaText size="large" fontWeightBold={600} color="secondaryColor">
							<ParaText size="large" fontWeightBold={600} color="black">
								My
							</ParaText>{' '}
							Notifications
						</ParaText>
					</Col>
					<Col xl={15} lg={15} md={15} sm={24} xs={24}>
						<div>
							<Row gutter={[16, 10]} style={{ display: 'flex', justifyContent: 'end' }} >
								<Col xl={5} lg={5} md={5} sm={12} xs={12}>
									<ParaText size="small" color="secondaryColor">
										{notificationData.length > 0 ? (
											<Popconfirm
												title="Delete All Notification"
												description="Are you sure to delete all notification?"
												onConfirm={async () => handleDeleteAll()}
												okText="Yes"
												cancelText="No"
											>
												<Button
													style={{ width: '100%', paddingLeft: '8px', paddingRight: '8px' }}
													type="primary" danger ghost
													onClick={handleDeleteAll}
													icon={<DeleteOutlined />}
												>
													Delete all messages
												</Button>
											</Popconfirm>
										) : (
											''
										)}
									</ParaText>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
				<div className="smallTopMargin"></div>
				{currentNotification.length > 0 ? (
					<>
						{currentNotification.map((notification, index) => (
							<div
								key={notification._id}
								className={`${styles['ticketItem']} ${styles['messages']}`}
							>
								<div key={notification?._id} className={styles['ticketItem']}>
									<Row align="middle">
										<Col xl={1} lg={1} md={1} sm={4} xs={4}>
											<div style={{ borderRadius: '50%', marginTop: 'auto' }}>
												{notification?.notifyBy?.image ?
													<Image
														src={
															`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${notification?.notifyBy?.image}`
														}
														alt="Avatar"
														width="50px"
														height="50px"
														style={{ borderRadius: '50px' }}
														title={notification?.notifyBy?.fullName}
													/>
													: <Avatar size={44} icon={<UserOutlined />} />}
											</div>
										</Col>
										<Col
											xl={20}
											lg={20}
											md={20}
											sm={20}
											xs={20}
										// style={{ cursor: 'pointer' }}
										// onClick={() => handleNavigation(notification)}
										>
											<div key={index}
											>
												<ParaText size="extraSmall" color="black">

													{
														notification.url ?
															<Link href={notification.url} onClick={handleNavigation}>

																<div dangerouslySetInnerHTML={{ __html: notification?.notification }} style={{ cursor: 'pointer', fontSize: '13px' }} />

															</Link>
															:
															<div style={{ cursor: 'pointer', fontSize: '13px' }} dangerouslySetInnerHTML={{ __html: notification.notification }} />
													}

												</ParaText></div>
											<div style={{ display: 'flex', gap: '5px' }}>
												<div>
													<ParaText size="extraSmall" color="defaultColor">
														{notification?.createdAt && (
															<span style={{ fontSize: '11px' }}>
																{new Intl.DateTimeFormat('en-US', {
																	month: 'long',
																	day: 'numeric',
																	hour: 'numeric',
																	minute: 'numeric',
																	hour12: true
																})
																	.format(new Date(notification.createdAt))
																	.replace('at', ',')}
															</span>
														)}
													</ParaText>
												</div>
												<div style={{ padding: '3px' }}>
													<Tag color={
														notification.tag == 'registered' ? 'green' : 'blue'
													}>
														{notification.tag}
													</Tag>
												</div>
											</div>
										</Col>
										<Col className="textEnd" xl={3} lg={3} md={3} sm={24} xs={24}>
											<Popconfirm
												title="Delete Notification"
												description="Are you sure to delete this notification?"
												onConfirm={async () => handleDelete(notification._id)}
												okText="Yes"
												cancelText="No"
											>
												<Button danger ghost>
													<DeleteOutlined style={{ fontSize: '14px', cursor: 'pointer' }} />
												</Button>
											</Popconfirm>
										</Col>
									</Row>
								</div>
							</div>
						))}
						<Pagination
							current={currentPage}
							pageSize={itemsPerPage}
							total={notificationData.length}
							onChange={handleChangePage}
							showSizeChanger={false}
							style={{ marginTop: '20px', textAlign: 'center' }}
						/>
					</>
				) : (
					<div className="textCenter marginTopThree">
						<IoNotificationsOffOutline style={{ fontSize: '50px' }} />
						<br />
						<ParaText size="small" color="defaultColor" className="weight700">
							No New Notifications
						</ParaText>
						<br />
					</div>
				)}
			</div>
		</>
	);
}
