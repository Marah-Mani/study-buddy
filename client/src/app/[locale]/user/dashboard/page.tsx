'use client';
import React from 'react';
import styles from './dashboard.module.css';
import Titles from '@/app/commonUl/Titles';
export default function Dashboard() {
	return (
		<>
			<div className={styles.dashBody}>
				<div className="">
					<Titles level={5} color="black">
						Dashboard
					</Titles>
				</div>
				<div className="gapMarginTopOne"></div>
			</div>
		</>
	);
}
