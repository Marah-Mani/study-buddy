'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import { Menu, Image } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHome, IoSettings } from 'react-icons/io5';
import { FaProductHunt } from 'react-icons/fa';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getAllRoles } from '@/lib/commonApi';
import { AiOutlineUser } from "react-icons/ai";
import { Roles } from '@/lib/types';
import { BiSolidFileArchive } from 'react-icons/bi';
import { QuestionCircleOutlined, WechatOutlined, LogoutOutlined } from '@ant-design/icons';
type MenuItem = {
	key: string;
	link?: string; // Change to optional if not all items have link
	label: React.ReactNode;
	icon?: React.ReactNode;
	type?: 'group';
	children?: MenuItem[];
	customClass?: string;
};

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: 'group',
	customClass?: string
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type // Include the type property here
	} as MenuItem;
}

export default function MenuAUser() {
	const [isActive, setIsActive] = useState(true);
	const { logout } = useContext(AuthContext);
	const [role, setAllRole] = useState<Roles[]>([]);
	const { user } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [defaultSelectedKey, setDefaultSelectedKey] = useState('1')

	useEffect(() => {
		fetchData();
	}, [user]);

	const fetchData = async () => {
		try {
			const res = await getAllRoles();
			if (res.status === true) {
				setAllRole(res.data);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			ErrorHandler.showNotification(error);
		}
	};

	function handleClick(href: any) {
		if (href.key == 9) {
			logout();
		}
	}

	function handleLogout(e: any) {
		e.preventDefault();
		logout();
	}

	const staticItems: MenuItem[] = [
		getItem(
			'Dashboard',
			'1',
			<Link href="/en/user/dashboard">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '1' ? (
						<Image preview={false} src="/icons/yellowhome.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/yellowhome.png" alt="Inactive User" width={20} height={20} />
						)}
				</span>
			</Link>
		),
		getItem(
			'Users',
			'2',
			<Link href="/en/user/candidate">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '2' ? (
						<Image preview={false} src="/icons/yellowuser.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/yellowuser.png" alt="Inactive User" width={20} height={20} />
						)}
				</span>
			</Link>
		),
		getItem(
			'Market Place',
			'3',
			<Link href="/en/user/market-place">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '3' ? (
						<Image preview={false} src="/icons/yellowmarket.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/yellowmarket.png" alt="Inactive User" width={20} height={20} />
						)}
				</span>
			</Link>
		),

		getItem(
			'Q&A',
			'4',
			<Link href="/en/user/chat">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '4' ? (
						<Image preview={false} src="/icons/yellowchat.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/yellowchat.png" alt="Inactive User" width={20} height={20} />
						)}
				</span>
			</Link>
		),

		getItem(
			'Profile',
			'5',
			<Link href="/en/user/edit-profile">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '5' ? (
						<Image preview={false} src="/icons/yellowedit.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/yellowedit.png" alt="Inactive User" width={20} height={20} />
						)}
				</span>
			</Link>
		),
		getItem(
			'Chat',
			'6',
			<Link href="/en/user/chat">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '6' ? (
						<Image preview={false} src="/icons/yellowbubble-chat.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/yellowbubble-chat.png" alt="Inactive User" width={20} height={20} />
						)}
				</span>
			</Link>
		),

		// getItem(
		// 	'Settings',
		// 	'2',
		// 	<Link href="/en/user/settings">
		// 		<Image preview={false} src="/icons/home.png" alt="" width={20} height={20} />
		// 	</Link>
		// ),
		getItem(
			'',
			'10',
			<Link href="/en/user/settings"></Link>
		),
		getItem(
			'',
			'11',
			<Link href="/en/user/settings"></Link>
		),
		getItem(
			'',
			'12',
			<Link href="/en/user/settings"></Link>
		),
		getItem(
			'',
			'13',
			<Link href="/en/user/settings"></Link>
		),
		getItem(
			'',
			'14',
			<Link href="/en/user/settings"></Link>
		),
		getItem(
			'',
			'15',
			<Link href="/en/user/settings"></Link>
		),
		getItem(
			'',
			'16',
			<Link href="/en/user/settings"></Link>
		),
		getItem(
			'',
			'17',
			<Link href="/en/user/settings"></Link>
		),
		getItem(
			'',
			'20',
			<Link href="/en/login"></Link>
		),
		getItem(
			'Logout',
			'8',
			<Link href="/en/login">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '6' ? (
						<Image preview={false} src="/icons/yellow-off.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/yellow-off.png" alt="Inactive User" width={20} height={20} />
						)}
				</span>
			</Link>
		),
	];

	const pathname = usePathname();
	useEffect(() => {
		let defaultSelectedKey;
		switch (true) {
			case pathname === '/en/user/dashboard':
				setDefaultSelectedKey('1');
				break;
			case pathname === '/en/user/edit-profile':
				setDefaultSelectedKey('2');
				break;
			case pathname === '/en/user/candidate':
				setDefaultSelectedKey('3');
				break;
			case pathname === '/en/user/file-manager':
				setDefaultSelectedKey('4');
				break;
			case pathname === '/en/user/forums':
				setDefaultSelectedKey('5');
				break;
			case pathname === '/en/user/question-answer':
				setDefaultSelectedKey('6');
				break;
			case pathname === '/en/user/market-place':
				setDefaultSelectedKey('7');
				break;
			case pathname === '/en/user/chat':
				setDefaultSelectedKey('8');
				break;
			case pathname === '/en/user/notifications':
				setDefaultSelectedKey('7'); // Redirect to Dashboard
				break;
			default:
				// if (!defaultSelectedKey) {
				setDefaultSelectedKey('1');
		}
	}, [pathname])



	let dynamicItems: MenuItem[] = [];


	let items = staticItems;

	if (user?.roleId?.roleName !== 'user' && dynamicItems.length > 0) {
		items = dynamicItems;
	}

	return (
		<>
			<div id="menuId">
				<div className="dddd">
					<div className="menuDash darkMenuDashUser" id="menuDash">
						<div className="textCenter">
							<Link href="/">
							</Link>
						</div>
						<div className="gapMarginTop"></div>
						<Menu
							selectedKeys={[defaultSelectedKey]}
							mode="inline"
							theme="dark"
							items={items}
							onClick={handleClick}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
