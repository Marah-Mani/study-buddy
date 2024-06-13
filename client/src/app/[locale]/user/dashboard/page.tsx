'use client';
import React, { useContext } from 'react';
import styles from './dashboard.module.css';
import Titles from '@/app/commonUl/Titles';
import AuthContext from '@/contexts/AuthContext';

export default function Dashboard() {
	const { user } = useContext(AuthContext);

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
