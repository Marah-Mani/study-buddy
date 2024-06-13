'use client';
import React, { useContext, useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import ParaText from '@/app/commonUl/ParaText';
import { Card, Input } from 'antd';
import ErrorHandler from '@/lib/ErrorHandler';
import { saveStickyNote } from '@/lib/adminApi';
import AuthContext from '@/contexts/AuthContext';
export default function Dashboard() {
	const [note, setNote] = useState('');
	const { user, setUser } = useContext(AuthContext);

	useEffect(() => {
		if (user) setNote(user?.stickyNote || '');
	}, [user?._id]);

	const handleNote = async (value: any) => {
		try {
			setNote(value);
			const data = {
				userId: user?._id,
				stickyNote: value
			}
			const res = await saveStickyNote(data);
			if (res.status == true) {
				setUser(res.data);
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};

	return (
		<>
			<div className={styles.dashBody}>
				<div className="">
					<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
						Dashboard
					</ParaText>
				</div>
				<div className="gapMarginTopOne"></div>
				<Card
					style={{ width: '22%' }}
				>
					<ParaText size="extraSmall" fontWeightBold={600} color="SecondaryColor">
						Sticky Note
					</ParaText>
					<Input.TextArea
						style={{ width: '100%' }}
						placeholder="Write something..."
						autoSize={{ minRows: 6, maxRows: 10 }}
						onChange={(event) => { handleNote(event.target.value) }}
						value={note}
					/>
				</Card>
			</div>
		</>
	);
}
