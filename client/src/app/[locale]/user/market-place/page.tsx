'use client';
import React, { useState } from 'react';
import { Tabs } from 'antd';
import './style.css';
import MarketPlace from '@/components/MarketPlace';
import MyMarketPlace from '@/components/MarketPlace/MyMarketPlace';

export default function Page() {
	const [key, setKey] = useState('1');

	const items = [
		{ label: 'Market Place', component: <MarketPlace activeKey={key} /> },
		{ label: 'My Market Place', component: <MyMarketPlace activeKey={key} /> },
	].map((item, index) => ({
		label: item.label,
		key: String(index + 1),
		children: item.component
	}));

	return (
		<>
			<div className='boxInbox'>
				<Tabs tabPosition='top' defaultActiveKey="2" items={items} onChange={(value) => setKey(value)} />
			</div>
		</>
	);
}
