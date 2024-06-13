'use client';
import React from 'react';
import './style.css';
import { Badge, Col, Row } from 'antd';

interface DataProps {
	prmocode: any;
}
export default function BadgeSuccess({ prmocode }: DataProps) {
	return (
		<>
			<div className="BadgeButton">
				<Badge status="success" text={prmocode} className="success" />
			</div>
		</>
	);
}
