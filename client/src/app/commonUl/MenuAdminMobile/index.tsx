'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu, Image } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHome, IoSettings, IoDocumentText, IoFolderOpenOutline } from 'react-icons/io5';
import AuthContext from '@/contexts/AuthContext';
import ParaText from '../ParaText';
import Titles from '../Titles';

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

interface Props {
	onBack: () => void;
}

export default function MenuAdminMobile({ onBack }: Props) {
	const { logout } = useContext(AuthContext);
	const [defaultSelectedKey, setDefaultSelectedKey] = useState('1')
	const [isActive, setIsActive] = useState(true);


	function handleClick(href: any) {
		if (href.key == 10) {
			logout();
		}
	}

	const items: MenuItem[] = [
		getItem(
			'Dashboard',
			'1',
			<Link href="/en/admin/dashboard" onClick={() => { setIsActive(true), onBack() }}>
				<span>
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
			<Link href="/en/admin/users" onClick={() => { setIsActive(true), onBack() }}>
				<span>
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
			<Link href="/en/admin/market-place" onClick={() => { setIsActive(true), onBack() }}>
				<span>
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
			<Link href="/en/admin/question-answer" onClick={() => { setIsActive(true), onBack() }}>
				<span>
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
			<Link href="/en/admin/profile" onClick={() => { setIsActive(true), onBack() }}>
				<span>
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
			<Link href="/en/admin/chat" onClick={() => { setIsActive(true), onBack() }}>
				<span>
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
			<Link href="/en/admin/file-manager" onClick={() => { setIsActive(true), onBack() }}>
				<span>
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
			default:
				// if (!defaultSelectedKey) {
				setDefaultSelectedKey('1');
		}
	}, [pathname])

	return (
		<>
			<div id="menuIdMobile" className='adminSideMain'>
				<div className="menuDashMobile darkMenuDashMobile">
					<div className="">
						<Link href="/about">
							<Titles level={4} color='primaryColor'>StudyBuddy</Titles>
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
					<div className='loginBottom'>
						<Link href="/en/login" style={{ display: 'flex', gap: '5px' }} onClick={() => { setIsActive(true), onBack() }}>
							<span>
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
