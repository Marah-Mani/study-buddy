'use client';
import React, { useState } from 'react';
import './style.css';
import { Tabs } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import Brand from '@/components/Admin/Settings/Brand';
import SEO from '@/components/Admin/Settings/SEO';
import SocialMedia from '@/components/Admin/Settings/SocialMedia';
import Payment from '@/components/Admin/Settings/Payment';
import EmailSignature from '@/components/Admin/Settings/EmailSignature';
import EmailTemplate from '@/components/Admin/Settings/EmailTemplate';
import HeaderMenu from '@/components/Admin/Settings/HeaderMenu';
import FooterMenu from '@/components/Admin/Settings/FooterMenu';
import ChatSetting from '@/components/Admin/ChatSetting';

export default function Page() {
	const [key, setKey] = useState('1');

	const items = [
		{ label: 'Brand Setting', component: <Brand activeKey={key} /> },
		{ label: 'Payment Method Integration', component: <Payment activeKey={key} /> },
		{ label: 'SEO Integration', component: <SEO activeKey={key} /> },
		{ label: 'Social Media Integration', component: <SocialMedia activeKey={key} /> },
		{ label: 'Email Signature', component: <EmailSignature activeKey={key} /> },
		{ label: 'Email Templates', component: <EmailTemplate activeKey={key} /> },
		{ label: 'Header Setting', component: <HeaderMenu activeKey={key} /> },
		{ label: 'Footer Setting', component: <FooterMenu activeKey={key} /> },
		{ label: 'Chat Setting', component: <ChatSetting activeKey={key} /> },
	].map((item, index) => ({
		label: item.label,
		key: String(index + 1),
		children: item.component
	}));

	return (
		<>
			<div className='boxInbox'>
				<div className="largeTopMargin"></div>
				<ParaText size="large" fontWeightBold={600} color="primaryColor">
					Settings
				</ParaText>
				<div className="largeTopMargin"></div>
				<Tabs tabPosition='top' defaultActiveKey="1" items={items} onChange={(value) => setKey(value)} />
			</div>
		</>
	);
}
