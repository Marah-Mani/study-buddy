'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHome, IoSettings, IoDocumentText } from 'react-icons/io5';
import { FaAppStore, FaUsers, FaUserEdit } from 'react-icons/fa';
import { AiOutlineProfile } from "react-icons/ai";
import { SlEnvolopeLetter } from 'react-icons/sl';
import { SiBloglovin } from 'react-icons/si';
import AuthContext from '@/contexts/AuthContext';
import { LuListTodo } from "react-icons/lu";
import { MdManageAccounts } from "react-icons/md";
import { PiPhoneCall } from "react-icons/pi";
import { HiLightBulb } from "react-icons/hi";
import { FaFileInvoice } from "react-icons/fa";
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { FaFileCircleCheck } from 'react-icons/fa6';

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

const items: MenuItem[] = [
	getItem(
		'Dashboard',
		'1',
		<Link href="/en/admin/dashboard">
			<IoHome />
		</Link>
	),
	getItem(
		'Settings',
		'2',
		<Link href="/en/admin/settings">
			<IoSettings />
		</Link>
	),

	getItem(
		'Forums',
		'3',
		<Link href="/en/admin/forums">
			<IoDocumentText />
		</Link>
	),
	getItem(
		'Products',
		'4',
		<Link href="/en/admin/products">
			<IoDocumentText />
		</Link>
	),
	getItem(
		'Users',
		'5',
		<Link href="/en/admin/users">
			<IoDocumentText />
		</Link>
	)
];

export default function MenuAdmin() {
	const { logout } = useContext(AuthContext);
	const [defaultSelectedKey, setDefaultSelectedKey] = useState('1')

	function handleClick(href: any) {
		if (href.key == 10) {
			logout();
		}
	}

	const pathname = usePathname();
	useEffect(() => {
		let defaultSelectedKey;

		switch (true) {
			case pathname === '/en/admin/dashboard':
				setDefaultSelectedKey('1');
				break;
			case pathname === '/en/admin/forums':
				setDefaultSelectedKey('2');
				break;
			case pathname === '/en/admin/file-manager':
				setDefaultSelectedKey('3');
				break;
			case pathname === '/en/admin/products':
				setDefaultSelectedKey('4');
				break;
			case pathname === '/en/admin/users':
				setDefaultSelectedKey('5');
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
