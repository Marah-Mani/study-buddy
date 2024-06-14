'use client';
import React, { useState } from 'react';
import './style.css';
import { Tabs } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import EditProfile from '@/components/User/Profile/EditProfile';
import ResetPassword from '@/components/User/Profile/ResetPassword';

export default function Page() {
	const [key, setKey] = useState('1')
	const items = new Array(4).fill(null).map((_, i) => {
		const id = String(i + 1);
		let label = '';
		switch (i) {
			case 0:
				label = 'Edit Profile';
				break;
			case 1:
				label = 'Reset Password';
				break;
			default:
				break;
		}

		return {
			label: label,
			key: id,
			type: 'left',
			tabPosition: 'left',
			children: (
				<>
					{i === 0 && <EditProfile activeKey={key} />}
					{i === 1 && <ResetPassword activeKey={key} />}
				</>
			)
		};
	});
	return (
		<>
			<div className="smallTopMargin"></div>
			<div className='boxInbox'>
				<div className="largeTopMargin"></div>
				<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
					Profile
				</ParaText>
				<div className="largeTopMargin"></div>
				<Tabs tabPosition='left' defaultActiveKey="1" items={items} onChange={(value) => setKey(value)} />
			</div>
		</>
	);
}

