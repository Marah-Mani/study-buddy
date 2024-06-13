'use client';
import React from 'react';
import styles from './editButton.module.css';
import { LuPencil } from 'react-icons/lu';

export default function EditButton() {
	return (
		<>
			<button className={styles['editButton']}>
				<LuPencil />
			</button>
		</>
	);
}
