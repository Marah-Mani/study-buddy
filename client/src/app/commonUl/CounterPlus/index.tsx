import React from 'react';
import styles from './styles.module.css';
export default function CounterPlus() {
	return (
		<>
			<div className={styles['counter']}>
				<div className={styles['number']}>
					<span className={styles['minus']}>-</span>
					<input type="text" value="1" />
					<span className={styles['plus']}>+</span>
				</div>
			</div>
		</>
	);
}
