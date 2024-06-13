'use client';
import React from 'react';
import styles from './tableData.module.css';
import { Table } from 'antd';

const { Column } = Table;

interface ReportProps {
	reports: any;
}



export default function TableData({ reports }: ReportProps) {
	return (
		<>
			<div className={`${styles['tablePart']} table-container`}>
				<Table dataSource={reports}>
					<Column title="Property" dataIndex="firstName" key="firstName" />
					<Column title="Manager" dataIndex="lastName" key="lastName" />
					<Column title="Reviews" dataIndex="age" key="age" />
					<Column title="Total Bookings" dataIndex="address" key="address" />
					<Column title="Payment" dataIndex="payment" key="payment" />
					<Column title="Booking" dataIndex="booking" key="booking" />
					<Column title="Chart" dataIndex="chart" key="chart" />
				</Table>
			</div>

		</>
	);
}
