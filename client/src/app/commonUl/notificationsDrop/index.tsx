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
						<ParaText size="small" color="primaryColor">
							View As Public
						</ParaText>
					</a>
					<br />
					<a href="#">
						<ParaText size="small" color="secondaryColor">
							Delete
						</ParaText>
					</a>
					<br />
					<a href="#">
						<ParaText size="small" color="secondaryColor">
							Edit
						</ParaText>
					</a>
				</div>
			</div>
		</>
	);
}
