'use client';

import React from 'react';
import { Col, Row } from 'antd';
import MenuAdmin from '@/app/commonUl/MenuAdmin';
import TopBar from '@/app/commonUl/topBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<section>
			<TopBar />
			<div className="largeTopMargin"></div>
			<Row gutter={[24, 24]} className="myRow">
				<div className="largeTopMargin"></div>
				<Col sm={24} xs={24} md={24} lg={24} xl={4} xxl={4} className="mobileNone">
					<MenuAdmin />
				</Col>
				<Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={20}>
					<>
						<div className="layOutStyle">{children}</div>
					</>
				</Col>
			</Row>
		</section>
	);
}
