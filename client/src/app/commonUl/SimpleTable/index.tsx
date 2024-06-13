import React, { useEffect, useState } from 'react';
import './style.css';
import { Table } from 'antd';
import SkeletonLoader from '../SkeletonLoader';

export default function SimpleTable({ columns, dataSource, Bordered = false, expandable }: any) {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoading(false);
		}, 100); // Simulating a 2-second loading time. You can adjust this as needed.

		return () => clearTimeout(timer);
	}, []);
	return (
		<div className="table-wrapper">
			<div>
				{loading ? (
					<div>
						<SkeletonLoader height="500px" />
					</div>
				) : (
					<Table columns={columns} dataSource={dataSource} bordered={Bordered} expandable={expandable} />
				)}
			</div>
		</div>
	);
}
