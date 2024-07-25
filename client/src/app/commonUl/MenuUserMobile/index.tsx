'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import { Menu, Image } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoDocumentText, IoFolderOpenOutline, IoHome } from 'react-icons/io5';
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
import Titles from '../Titles';
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

interface Props {
	onBack: () => void;
}

export default function MenuUserMobile({ onBack }: Props) {
	const { logout } = useContext(AuthContext);
	const [role, setAllRole] = useState<Roles[]>([]);
	const { user } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);
	const [defaultSelectedKey, setDefaultSelectedKey] = useState('1')
	const [isActive, setIsActive] = useState(true);

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
		if (href.key == 12) {
			logout();
		}
	}



	const staticItems: MenuItem[] = [
		getItem(
			'Dashboard',
			'1',
			<Link href="/en/user/dashboard" onClick={() => { setIsActive(true), onBack() }}>
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
			'All Users',
			'2',
			<Link href="/en/user/candidate" onClick={() => { setIsActive(true), onBack() }}>
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
			<Link href="/en/user/market-place" onClick={() => { setIsActive(true), onBack() }}>
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
			<Link href="/en/user/question-answer" onClick={() => { setIsActive(true), onBack() }}>
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
			<Link href="/en/user/edit-profile" onClick={() => { setIsActive(true), onBack() }}>
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
			<Link href="/en/user/chat" onClick={() => { setIsActive(true), onBack() }}>
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
			<Link href="/en/user/file-manager" onClick={() => { setIsActive(true), onBack() }}>
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
			<Link href="/en/user/studybuddy" onClick={() => { setIsActive(true), onBack() }}>
				<span onClick={() => setIsActive(true)} >
					{defaultSelectedKey === '9' ? (
						<Image preview={false} src="/icons/study.png" alt="Active User" width={20} height={20} />
					)
						:
						(
							<Image preview={false} src="/icons/study.png" alt="Active User" width={20} height={20} />
						)}
				</span>
			</Link>
		)
	];
	let dynamicItems: MenuItem[] = [];

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

	// function setIsActive(arg0: boolean): void {
	// 	throw new Error('Function not implemented.');
	// }

	return (
		<>
			<div id="menuIdMobile" className='adminSideMain'>
				<div className="menuDashMobile darkMenuDash">
					<div className="">
						<Link href="/about">
							<Titles level={4} color='primaryColor'>StudyBuddy</Titles>
						</Link>
					</div>
					<div className='gapPaddingTopOTwo'></div>
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
								{defaultSelectedKey === '12' ? (
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
