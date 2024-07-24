'use client';

import React from 'react';
import { Col, Row } from 'antd';
import TopBar from '@/app/commonUl/topBar';
import MenuUser from '@/app/commonUl/MenuUser';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const segments = pathname.split('/').filter(Boolean);
	const desiredSegment = segments[segments.length - 1];
	return (

		<>
			{desiredSegment === 'chat' ? (
				<>
					<TopBar />
					<div className='chatMan'>
						<div className='leftChatBar'>
							<div className="largeTopMargin"></div>
							<MenuUser />
						</div>
						<div className='rightChatBar'>
							<div className="">{children}</div>
						</div>
					</div>
				</>
			) : (
				<section>
					<TopBar />
					<div className="largeTopMargin"></div>
					<Row className="myRow">
						<div className="largeTopMargin"></div>
						<Col sm={24} xs={24} md={24} lg={24} xl={4} xxl={4} className="mobileNone">
							<MenuUser />
						</Col>
						<Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={20}>
							<>
								<div className="layOutStyle add-remove chat-remove-padding">{children}</div>
							</>
						</Col>
					</Row>
				</section>
			)}
		</>
	);
}
