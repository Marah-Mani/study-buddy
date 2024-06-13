'use client';
import './style.css';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHome } from 'react-icons/io5';
import { FaAppStore } from 'react-icons/fa';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getAllRoles } from '@/lib/commonApi';
import { AiOutlineProfile } from "react-icons/ai";
import { LuListTodo } from "react-icons/lu";
import { SlEnvolopeLetter } from 'react-icons/sl';
import { Roles } from '@/lib/types';
import ParaText from '@/app/commonUl/ParaText';
import { Slider, Image } from 'antd';
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

export default function SideMenu() {
	const [stepsCount, setStepsCount] = React.useState<number>(5);
	const [stepsGap, setStepsGap] = React.useState<number>(7);
	const { logout } = useContext(AuthContext);
	const [role, setAllRole] = useState<Roles[]>([]);
	const { user } = useContext(AuthContext);
	const [loading, setLoading] = useState(true);

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


	const staticItems: MenuItem[] = [
		getItem(
			'My Files',
			'1',
			<Link href="/en/customer/dashboard">
				<IoHome />
			</Link>
		),
		getItem(
			'Favorites',
			'2',
			<Link href="/en/customer/my-property">
				<AiOutlineProfile />
			</Link>
		),
		getItem(
			'Shared Files',
			'3',
			<Link href="/en/customer/my-profile">
				<LuListTodo />
			</Link>
		),
		getItem(
			'Recycle Bin',
			'4',
			<Link href="/en/user/recycle-bin">
				<LuListTodo />
			</Link>
		),

		getItem(
			'Recent Files',
			'5',
			<Link href="/en/customer/tickets">
				<SlEnvolopeLetter />
			</Link>
		),

		// getItem(
		// 	'Mechanical',
		// 	'6',
		// 	<Link href="/en/customer/notifications">
		// 		<LuListTodo />
		// 	</Link>
		// ),
		// getItem(
		// 	'Civil',
		// 	'6',
		// 	<Link href="/en/customer/notifications">
		// 		<LuListTodo />
		// 	</Link>
		// ),
		// getItem(
		// 	'Computer Science',
		// 	'6',
		// 	<Link href="/en/customer/notifications">
		// 		<LuListTodo />
		// 	</Link>
		// ),
		// getItem(
		// 	'Log out',
		// 	'6',
		// 	<Link href="/en/customer/notifications">
		// 		<LuListTodo />
		// 	</Link>
		// ),
	];
	const pathname = usePathname();

	let defaultSelectedKey;
	switch (true) {
		case pathname === '/en/customer/dashboard':
			defaultSelectedKey = '1';
			break;
		case pathname === '/en/customer/my-property':
			defaultSelectedKey = '2';
			break;
		case pathname === '/en/customer/my-profile':
			defaultSelectedKey = '3';
			break;
		case pathname === '/en/customer/new-projects':
			defaultSelectedKey = '4';
			break;
		case pathname === '/en/customer/tickets':
			defaultSelectedKey = '5';
			break;
		case pathname === '/en/customer/notifications':
			defaultSelectedKey = '6';
			break;
		case pathname === '/en/customer/payments':
			defaultSelectedKey = '7';
			break;
		default:
			if (!defaultSelectedKey) {
				defaultSelectedKey = '1';
			}
	}



	let dynamicItems: MenuItem[] = [];

	if (role) {
		dynamicItems = role
			.flatMap(item => {
				if (item.roleName.toLowerCase() === (user?.roleId?.roleName.toLowerCase() ?? '')) {
					const permissions = item.permissions;
					// console.log(permissions);
					const allowedPermissions = Object.keys(permissions)
						.filter(key => permissions[key] === true)
						.map(permission => permission.toLowerCase());

					return staticItems.filter(menuItem => {
						const label = menuItem.label as string; // Type assertion
						return allowedPermissions.includes(label.toLowerCase());
					});
				}
				return [];
			});
	}


	let items = staticItems;

	// if (user?.roleId?.roleName !== 'user' && dynamicItems.length > 0) {
	// 	items = dynamicItems;
	// }

	return (
		<>
			<div id="menuIdd">
				<div className="dddd">
					<div className="menuDash1" id="menuDash">
						<div className="textCenter">
							<Link href="/">
							</Link>
						</div>
						<Menu
							defaultSelectedKeys={[defaultSelectedKey]}
							mode="inline"
							theme="dark"
							items={items}
							onClick={handleClick}
						/>
						{/* <div className='leftPadding'>
							<ParaText size='textGraf' color='black' fontWeightBold={800}> 69.42GB</ParaText>
							<ParaText size='textGraf' color='black'> Used</ParaText>
							<ParaText size='textGraf' color='black' className='dBlock'> 58% Used - 51.04Gb free</ParaText>
							<Slider min={2} max={10} value={stepsCount} onChange={setStepsCount} />
							<div className='upgradeBox'>
								<Image src="https://nextjs.spruko.com/ynex-js/preview/assets/images/media/file-manager/2.png" width={130} height={130} alt='' preview={false}> </Image>
							</div>
						</div> */}

					</div>
				</div>

			</div>
		</>
	);
}
