'use client';
import React, { useState } from 'react';
import './style.css';
import { Tabs } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import EmailSignature from '@/components/Admin/Settings/EmailSignature';
import EmailTemplate from '@/components/Admin/Settings/EmailTemplate';
import ChatSetting from '@/components/Admin/ChatSetting';

export default function Page() {
	const [key, setKey] = useState('1');

	const items = [
		{ label: 'Email Signature', component: <EmailSignature activeKey={key} /> },
		{ label: 'Email Templates', component: <EmailTemplate activeKey={key} /> },
		{ label: 'Chat Setting', component: <ChatSetting activeKey={key} /> },
	].map((item, index) => ({
		label: item.label,
		key: String(index + 1),
		children: item.component
	}));

	return (
		<>
			<div className='boxInbox'>
				<ParaText size="large" fontWeightBold={600} color="primaryColor">
					Settings
				</ParaText>
				<div className="largeTopMargin"></div>
				<Tabs tabPosition='top' defaultActiveKey="1" items={items} onChange={(value) => setKey(value)} />
			</div>
		</>
	);
}
