'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHome, IoSettings, IoDocumentText } from 'react-icons/io5';
import AuthContext from '@/contexts/AuthContext';
import { FaFileCircleCheck, FaProductHunt } from 'react-icons/fa6';
import { UserOutlined, WechatOutlined, QuestionCircleOutlined, LogoutOutlined } from '@ant-design/icons';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: 'group'
): MenuItem {
	return {
		key,
		icon,
		label,
		type,
		children
	} as MenuItem;
}




export default function MenuAdmin() {
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
				<IoHome size={20} />
			</Link>
		),
		getItem(
			'Users',
			'5',
			<Link href="/en/admin/users">
				<UserOutlined size={20} />
			</Link>
		),
		getItem(
			'Market Place',
			'4',
			<Link href="/en/admin/market-place">
				<FaProductHunt size={20} />
			</Link>
		),
		getItem(
			'File Manager',
			'6',
			<Link href="/en/admin/file-manager">
				<FaFileCircleCheck size={20} />
			</Link>
		),
		getItem(
			'Forums',
			'3',
			<Link href="/en/admin/forums">
				<QuestionCircleOutlined size={20} />
			</Link>
		),

		getItem(
			'Chats',
			'7',
			<Link href="/en/admin/chat">
				<WechatOutlined size={20} />
			</Link>
		),
		getItem(
			'Settings',
			'2',
			<Link href="/en/admin/settings">
				<IoSettings size={20} />
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
			'20',
			<Link href="/en/login"></Link>
		),
		getItem(
			'Logout',
			'8',
			<Link onClick={handleLogout} href='#'>
				<LogoutOutlined size={25} />
			</Link>
		),
	];

	const pathname = usePathname();
	useEffect(() => {
		let defaultSelectedKey;

		switch (true) {
			case pathname === '/en/admin/dashboard':
				setDefaultSelectedKey('1');
				break;
			case pathname === '/en/admin/settings':
				setDefaultSelectedKey('2');
				break;
			case pathname === '/en/admin/forums':
				setDefaultSelectedKey('3');
				break;
			case pathname === '/en/admin/market-place':
				setDefaultSelectedKey('4');
				break;
			case pathname === '/en/admin/users':
				setDefaultSelectedKey('5');
				break;
			case pathname === '/en/admin/file-manager':
				setDefaultSelectedKey('6');
				break;
			case pathname === '/en/admin/chat':
				setDefaultSelectedKey('7');
				break;
			case pathname === '/en/login':
				setDefaultSelectedKey('8');
				break;
			case pathname === '/en/admin/question-answer':
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
