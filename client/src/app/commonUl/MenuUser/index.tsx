'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import { Menu, Image } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoFolderOpenOutline } from 'react-icons/io5';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getAllRoles } from '@/lib/commonApi';
import { Roles } from '@/lib/types';

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
		type,
		customClass,
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
		if (href.key == 10) {
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
			<Link href="/en/user/question-answer">
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
		getItem(
			'File Manager',
			'8',
			<Link href="/en/user/file-manager">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '8' ? (
						<IoFolderOpenOutline style={{ color: '#d49737', width: '20px', height: '20px' }} />
					)
						:
						(
							<IoFolderOpenOutline style={{ color: '#d49737', width: '20px', height: '20px' }} />
						)}
				</span>
			</Link>
		),
		getItem(
			'StuddyBuddy',
			'9',
			<Link href="/en/user/studybuddy">
				<span onClick={() => setIsActive(true)} >
					{defaultSelectedKey === '8' ? (
						<Image preview={false} src="/icons/logo.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/logo.png" alt="Active User" width={20} height={20} />
						)}
				</span>
			</Link>
		),
		getItem(
			'Logout',
			'7',
			<Link href="/en/login">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '7' ? (
						<Image preview={false} src="/icons/yellow-off.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/yellow-off.png" alt="Inactive User" width={20} height={20} />
						)}
				</span>
			</Link>,
			undefined,
			undefined,
			'logout-bottom',
		),
	];

	const pathname = usePathname();
	useEffect(() => {
		let defaultSelectedKey;
		switch (true) {
			case pathname === '/en/user/dashboard':
				setDefaultSelectedKey('1');
				break;
			case pathname === '/en/user/candidate':
				setDefaultSelectedKey('2');
				break;
			case pathname === '/en/user/market-place':
				setDefaultSelectedKey('3');
				break;
			case pathname.includes('/en/user/question-answer') || pathname.includes('/en/user/question'):
				setDefaultSelectedKey('4');
				break;
			case pathname === '/en/user/edit-profile':
				setDefaultSelectedKey('5'); // Redirect to Dashboard
				break;
			case pathname === '/en/user/chat':
				setDefaultSelectedKey('6'); // Redirect to Dashboard
				break;
			case pathname === '/en/login':
				setDefaultSelectedKey('7'); // Redirect to Dashboard
				break;
			case pathname === '/en/user/file-manager':
				setDefaultSelectedKey('8');
				break;
			case pathname === '/en/user/studybuddy':
				setDefaultSelectedKey('9');
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
						<div className="gapPaddingTopOTwo"></div>
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
