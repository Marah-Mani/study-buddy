'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu, Image } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import { IoFolderOpenOutline } from 'react-icons/io5';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: 'group',
	customClass?: string,
	className?: string // Include custom class name here
): MenuItem {
	return {
		key,
		icon,
		label: <div className={className}>{label}</div>, // Apply custom class here
		type,
		children,
		customClass
	} as MenuItem;
}

export default function MenuAdmin() {
	const [isActive, setIsActive] = useState(true);
	const { logout } = useContext(AuthContext);
	const [defaultSelectedKey, setDefaultSelectedKey] = useState('1')

	function handleClick(href: any) {
		if (href.key == 10) {
			logout();
		}
	}

	function handleLogout(e: any) {
		e.preventDefault();
		logout();
	}

	const items: MenuItem[] = [
		getItem(
			'Dashboard',
			'1',
			<Link href="/en/admin/dashboard">
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
			<Link href="/en/admin/users">
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
			<Link href="/en/admin/market-place">
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
			<Link href="/en/admin/question-answer">
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
			<Link href="/en/admin/profile">
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
			<Link href="/en/admin/chat">
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
			<Link href="/en/admin/file-manager">
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
			'StudyBuddy',
			'9',
			<Link href="/en/admin/studybuddy">
				<span onClick={() => setIsActive(true)}>
					{defaultSelectedKey === '9' ? (
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
			'',
			'20',

		),
		getItem(
			'',
			'20',

		),
		getItem(
			'',
			'20',

		),
		getItem(
			'',
			'20',

		),
		getItem(
			'',
			'20',

		),
		getItem(
			'',
			'20',

		),
		getItem(
			'',
			'20',

		),
		getItem(
			'',
			'20',

		),
		getItem(
			'',
			'20',

		),
		getItem(
			'',
			'20',

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
			'logout-bottom'
		),

	];

	const pathname = usePathname();
	useEffect(() => {
		let defaultSelectedKey;
		switch (true) {
			case pathname === '/en/admin/dashboard':
				setDefaultSelectedKey('1');
				break;
			case pathname === '/en/admin/users':
				setDefaultSelectedKey('2');
				break;
			case pathname === '/en/admin/market-place':
				setDefaultSelectedKey('3');
				break;
			case pathname === '/en/admin/question-answer':
				setDefaultSelectedKey('4');
				break;
			case pathname === '/en/admin/profile':
				setDefaultSelectedKey('5');
				break;
			case pathname === '/en/admin/chat':
				setDefaultSelectedKey('6');
				break;
			case pathname === '/en/login':
				setDefaultSelectedKey('7');
				break;
			case pathname === '/en/admin/file-manager':
				setDefaultSelectedKey('8');
				break;
			case pathname === '/en/admin/studybuddy':
				setDefaultSelectedKey('9');
				break;
			default:
				// if (!defaultSelectedKey) {
				setDefaultSelectedKey('1');
		}
	}, [pathname])

	return (
		<>
			<div id="menuId">
				<div className="dddd">
					<div className="menuDash darkMenuDash" id="menuDash">
						<div className="textCenter">
							<Link href="/"></Link>
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
