'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import { Menu, Image } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoDocumentText, IoHome } from 'react-icons/io5';
import { FaAppStore } from 'react-icons/fa';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getAllRoles } from '@/lib/commonApi';
import { AiOutlineProfile, AiOutlineUser } from "react-icons/ai";
import { LuListTodo } from "react-icons/lu";
import { SlEnvolopeLetter } from 'react-icons/sl';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { Roles } from '@/lib/types';
import { BiSolidFileArchive } from 'react-icons/bi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ParaText from '../ParaText';
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

export default function MenuUserMobile() {
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
			case pathname === '/en/user/market-place':
				setDefaultSelectedKey('6');
				break;
			case pathname === '/en/user/notifications':
				setDefaultSelectedKey('7'); // Redirect to Dashboard
				break;
			default:
				// if (!defaultSelectedKey) {
				setDefaultSelectedKey('1');
		}
	}, [pathname])


	const staticItems: MenuItem[] = [
		getItem(
			'Dashboard',
			'1',
			<Link href="/en/user/dashboard">
				<IoHome />
			</Link>
		),
		getItem(
			'Profile',
			'2',
			<Link href="/en/user/edit-profile">
				<AiOutlineProfile />
			</Link>
		),
		getItem(
			'Users',
			'3',
			<Link href="/en/user/candidate">
				<AiOutlineUser />
			</Link>
		),
		getItem(
			'File Manager',
			'4',
			<Link href="/en/user/file-manager">
				<BiSolidFileArchive />
			</Link>
		),
		getItem(
			'Q&A',
			'5',
			<Link href="/en/user/forums">
				<QuestionCircleOutlined />
			</Link>
		),
		getItem(
			'Market Place',
			'6',
			<Link href="/en/user/market-place">
				<IoDocumentText />
			</Link>
		)
	];

	let dynamicItems: MenuItem[] = [];

	if (role) {
		// dynamicItems = role
		// 	.flatMap(item => {
		// 		if (item.roleName.toLowerCase() === (user?.roleId?.roleName.toLowerCase() ?? '')) {
		// 			const permissions = item.permissions;
		// 			console.log(permissions);
		// 			const allowedPermissions = Object.keys(permissions)
		// 				.filter(key => permissions[key] === true)
		// 				.map(permission => permission.toLowerCase());

		// 			return staticItems.filter(menuItem => {
		// 				const label = menuItem.label as string; // Type assertion
		// 				return allowedPermissions.includes(label.toLowerCase());
		// 			});
		// 		}
		// 		return [];
		// 	});
	}

	let items = staticItems;

	if (user?.roleId?.roleName !== 'user' && dynamicItems.length > 0) {
		items = dynamicItems;
	}

	function setIsActive(arg0: boolean): void {
		throw new Error('Function not implemented.');
	}

	return (
		<>
			<div id="menuIdMobile" className='adminSideMain'>
				<div className="menuDashMobile darkMenuDash">
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
					<div className='loginBottom'>
						<Link href="/en/login" style={{ display: 'flex', gap: '5px' }}>
							<span onClick={() => setIsActive(true)}>
								{defaultSelectedKey === '7' ? (
									<Image preview={false} src="/icons/yellow-off.png" alt="Active User" width={20} height={20} />
								)
									:
									(
										<Image preview={false} src="/icons/yellow-off.png" alt="Inactive User" width={20} height={20} />
									)}
							</span>
							<ParaText size='extraSmall' color='white'>Logout</ParaText>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
