'use client';
import React from 'react';
import styles from './notificationsBlank.module.css';
import ParaText from '../ParaText';

export default function NotificationsDrop() {
	return (
		<>
			<div className={styles['notificationsBlank']}>
				<div className="textEnd">
					<a href="#">
						<ParaText size="small" color="PrimaryColor">
							View As Public
						</ParaText>
					</a>
					<br />
					<a href="#">
						<ParaText size="small" color="SecondaryColor">
							Delete
						</ParaText>
					</a>
					<br />
					<a href="#">
						<ParaText size="small" color="SecondaryColor">
							Edit
						</ParaText>
					</a>
				</div>
			</div>
		</>
	);
}
