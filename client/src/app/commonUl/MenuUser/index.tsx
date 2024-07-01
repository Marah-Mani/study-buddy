'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import { Menu } from 'antd';
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

	function handleLogout(e: any) {
		e.preventDefault();
		logout();
	}

	const staticItems: MenuItem[] = [
		getItem(
			'Dashboard',
			'1',
			<Link href="/en/user/dashboard">
				<IoHome size={18} />
			</Link>
		),
		getItem(
			'Users',
			'3',
			<Link href="/en/user/candidate">
				<AiOutlineUser size={18} />
			</Link>
		),
		getItem(
			'Market Place',
			'7',
			<Link href="/en/user/market-place">
				<FaProductHunt size={18} />
			</Link>
		),
		getItem(
			'File Manager',
			'4',
			<Link href="/en/user/file-manager">
				<BiSolidFileArchive size={18} />
			</Link>
		),
		getItem(
			'Q&A',
			'6',
			<Link href="/en/user/question-answer">
				<QuestionCircleOutlined size={18} />
			</Link>
		),
		getItem(
			'Chat',
			'8',
			<Link href="/en/user/chat">
				<WechatOutlined size={18} />
			</Link>
		),


		getItem(
			'Profile',
			'2',
			<Link href="/en/user/edit-profile">
				<IoSettings size={18} />
			</Link>
		),

		getItem(
			'',
			'10',
			<Link href="/en/admin/settings"></Link>
		),
		getItem(
			'',
			'11',
			<Link href="/en/admin/settings"></Link>
		),
		getItem(
			'',
			'12',
			<Link href="/en/admin/settings"></Link>
		),
		getItem(
			'',
			'13',
			<Link href="/en/admin/settings"></Link>
		),
		getItem(
			'',
			'14',
			<Link href="/en/admin/settings"></Link>
		),
		getItem(
			'',
			'15',
			<Link href="/en/admin/settings"></Link>
		),
		getItem(
			'',
			'16',
			<Link href="/en/admin/settings"></Link>
		),
		getItem(
			'',
			'17',
			<Link href="/en/admin/settings"></Link>
		),
		getItem(
			'',
			'18',
			<Link href="/en/login"></Link>
		),
		getItem(
			'Logout',
			'9',
			<Link onClick={handleLogout} href="/en/login">
				<LogoutOutlined size={20} />
			</Link>
		),
	];

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
