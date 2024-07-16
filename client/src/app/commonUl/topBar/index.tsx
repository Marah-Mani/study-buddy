'use client';
import React, { useState, useEffect, useContext } from 'react';
import './style.css';
import { Col, Divider, Drawer, Image, Row, Badge, Avatar, Button } from 'antd';
import { FaRegBell } from 'react-icons/fa6';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import Link from 'next/link';
import ParaText from '../ParaText';
import { UserOutlined } from '@ant-design/icons';
import { IoNotificationsOffOutline } from 'react-icons/io5';
import { usePathname, useRouter } from 'next/navigation';
import { getUserNotification, updateReadStatus } from '@/lib/commonApi';
import UserAvatarForHeader from '../UserAvatarForHeader';
import LastLoginDateTime from '@/components/frontend/LastLoginDateTime';
import { getHeaderMenus } from '@/lib/frontendApi';
import { CiDark } from 'react-icons/ci';
import { MdDarkMode } from 'react-icons/md';
import { IoMenuSharp } from 'react-icons/io5';
import MenuUserMobile from '../MenuUserMobile';
import MenuAdminMobile from '../MenuAdminMobile';
import Titles from '../Titles';

export default function TopBar() {
	const [showNotificationBell, setShowNotificationBell] = useState(false);
	const { user } = useContext(AuthContext);
	const [notificationData, setNotificationData] = useState<any[]>([]);
	const [latestBell, setLatestBell]: any = useState('');
	const [headerMenu, setHeaderMenu] = useState<any>([]);
	const pathName = usePathname();

	const router = useRouter();
	const handleDivClickBell = (event: any) => {
		event.stopPropagation();
		if (user) {
			fetchAllNotifications();
		}
		setShowNotificationBell(true);
	};

	useEffect(() => {
		fetchAllNotifications();
		fetchHeaderMenu();
	}, []);

	const fetchHeaderMenu = async () => {
		try {
			const res = await getHeaderMenus();
			if (res.status === true) {
				setHeaderMenu(res.data);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	const fetchAllNotifications = async () => {
		try {
			if (user) {
				const res = await getUserNotification(user?._id);
				if (res.status === true) {
					setNotificationData(res.data);
					if (res.data.length > 0) {
						setLatestBell(res.data[0]);
					}
				}
			}
		} catch (error) { }
	};

	const handleDashboardHeading = () => {
		const pathSegments = pathName.split('/');
		let specificPath: string | undefined = pathSegments.pop();
		if (specificPath && /\d+/.test(specificPath)) {
			specificPath = pathSegments.pop();
		}
	};

	const handleWindowClick = () => {
		setShowNotificationBell(false);
	};
	useEffect(() => {
		handleDashboardHeading();
		window.addEventListener('click', handleWindowClick);

		// Retrieve notification data from session storage when the component mounts
		const storedNotificationData = sessionStorage.getItem('notificationData');
		if (storedNotificationData) {
			setNotificationData(JSON.parse(storedNotificationData));
		}
	}, []);

	const handleNavigation = async () => {
		try {
			const data = {
				userId: user?._id,
				isRead: 'yes'
			};
			const res = await updateReadStatus(data);
			if (res.success === true) {
				setShowNotificationBell(false);
				router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${user?.role}/notifications`);
			}
		} catch (error) {
			// ErrorHandler.showNotification(error);
		}
	};

	const [darkMode, setDarkMode] = useState(false);

	const handleToggle = () => {
		setDarkMode(!darkMode);
	};

	useEffect(() => {
		if (darkMode) {
			document.body.classList.add('dark-mode');
		} else {
			document.body.classList.remove('dark-mode');
		}
	}, [darkMode]);

	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<>
			<div className="topBar">
				<Row align="middle" gutter={[10, 10]}>
					<Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
						<Link href={`${process.env['NEXT_PUBLIC_SITE_URL']}`} target="_blank">
							<Link href="/">
								<Titles level={4} color='primaryColor'>StudyBuddy</Titles>
							</Link>
						</Link>
					</Col>
					{/* <Col xs={0} sm={0} md={16} lg={16} xl={16} xxl={16} className={'textCenter'}>
						{headerMenu.length > 0 &&
							headerMenu.map((menu: any, index: any) => {
								return (
									<Link style={{ paddingLeft: '10px' }} key={index} href={`${menu.link}`}>
										<ParaText size="small" color="secondaryColor">
											{menu.title}
										</ParaText>
									</Link>
								);
							})}
						<div></div>
					</Col> */}
					<Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
						<div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'end' }}>
							<div className="mobileMenu">
								<div className="menuIcon" onClick={showDrawer}>
									<IoMenuSharp color="#000" size={20} />
								</div>
							</div>
							<div>
								<Button
									onChange={handleToggle}
									defaultChecked
									type="text"
									onClick={handleToggle}
									icon={
										darkMode ? (
											<MdDarkMode color="#fff" size={20} />
										) : (
											<CiDark color="#fff" size={20} />
										)
									}
								/>
							</div>
							<div onClick={handleDivClickBell}>
								{latestBell.isRead === '' ? (
									<FaRegBell size={20} color="#fff" />
								) : (
									<div
										className="bell"
										onClick={(e) => {
											handleDivClickBell(e);
										}}
									>
										<FaRegBell color="#fff" size={20} />
									</div>
								)}
							</div>

							{showNotificationBell && (
								<Drawer
									title={
										<div>
											<ParaText size="small" color="primaryColor">
												Notifications
											</ParaText>
										</div>
									}
									footer={
										<div className="textCenter">
											<ParaText size="small" color="secondaryColor">
												<b style={{ cursor: 'pointer' }} onClick={handleNavigation}></b>
											</ParaText>
										</div>
									}
									onClose={() => setShowNotificationBell(false)}
									open={showNotificationBell}
								>
									{notificationData.length > 0 ? (
										<>
											{notificationData.map((notification: any, index: any) => {
												if (index < 15) {
													return (
														<Row key={notification._id} gutter={24}>
															<Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
																{notification?.notifyBy?.image ? (
																	<div
																		style={{
																			borderRadius: '50%',
																			marginTop: 'auto',
																			width: '60px',
																			height: '60px'
																		}}
																	>
																		<Image
																			src={
																				notification?.notifyBy?.image
																					? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${notification?.notifyBy?.image}`
																					: `/images/avatar.png`
																			}
																			alt="Avatar"
																			width="40px"
																			height="40px"
																			style={{ borderRadius: '50px' }}
																			preview={false}
																		/>
																	</div>
																) : (
																	<Avatar size={44} icon={<UserOutlined />} />
																)}
															</Col>
															<Col xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
																<div key={index}>
																	<ParaText size="extraSmall" color="black">
																		{notification.url ? (
																			<Link href={notification.url}>
																				<div
																					dangerouslySetInnerHTML={{
																						__html: notification?.notification
																					}}
																					style={{
																						cursor: 'pointer',
																						fontSize: '13px'
																					}}
																				/>
																			</Link>
																		) : (
																			<div
																				style={{
																					cursor: 'pointer',
																					fontSize: '13px'
																				}}
																				dangerouslySetInnerHTML={{
																					__html: notification.notification
																				}}
																			/>
																		)}
																	</ParaText>
																</div>
																<span style={{ fontSize: '10px', color: 'white' }}>
																	{notification?.createdAt && (
																		<span style={{ fontSize: '11px' }}>
																			{new Intl.DateTimeFormat('en-US', {
																				month: 'long',
																				day: 'numeric',
																				hour: 'numeric',
																				minute: 'numeric',
																				hour12: true
																			})
																				.format(
																					new Date(notification.createdAt)
																				)
																				.replace('at', ',')}
																		</span>
																	)}
																</span>
															</Col>
															<Col xs={1} sm={1} md={2} lg={2} xl={2} xxl={2}>
																<div>
																	{notification?.isRead == 'no' ? (
																		<Badge status="processing" text="" />
																	) : (
																		''
																	)}
																</div>
															</Col>
															<Divider />
														</Row>
													);
												} else {
													return false;
												}
											})}
										</>
									) : (
										<div className="textCenter marginTopThree">
											<IoNotificationsOffOutline className="notificationsNone" />
											<br />
											<ParaText size="small" color="defaultColor" className="weight700">
												No New Notifications
											</ParaText>
											<br />
											<ParaText size="small" color="defaultColor">
												Check this section for job updates, and general notifications.
											</ParaText>
										</div>
									)}
								</Drawer>
							)}
							<div className="textCenter">
								<UserAvatarForHeader />
							</div>
						</div>
					</Col>
					<div>
						<LastLoginDateTime />
					</div>
				</Row>
				<Drawer
					title="StudyBuddy"
					className="paddingRemoveBody"
					onClose={onClose}
					open={open}
					placement="left"
					width="300"
				>
					{user?.role == 'admin' ? <MenuAdminMobile /> : <MenuUserMobile />}
				</Drawer>
			</div>
		</>
	);
}
