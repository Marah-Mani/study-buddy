'use client';
import React, { useState } from 'react';
import { Tabs } from 'antd';
import './style.css';
import MarketPlace from '@/components/MarketPlace';
import MyMarketPlace from '@/components/MarketPlace/MyMarketPlace';

export default function Page() {
	const [key, setKey] = useState('1');

	const items = [
		{ label: 'My Market Place', component: <MyMarketPlace activeKey={key} /> },
		{ label: 'Market Place', component: <MarketPlace activeKey={key} /> },
	].map((item, index) => ({
		label: item.label,
		key: String(index + 1),
		children: item.component
	}));

	return (
		<>
			<div className="smallTopMargin"></div>
			<div className='boxInbox'>
				<div className="largeTopMargin"></div>
				<Tabs tabPosition='top' defaultActiveKey="1" items={items} onChange={(value) => setKey(value)} />
			</div>
		</>
	);
}
