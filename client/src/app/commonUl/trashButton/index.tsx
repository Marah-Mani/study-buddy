'use client';
import React from 'react';
import styles from './trashButton.module.css';
import { BiTrashAlt } from 'react-icons/bi';

export default function TrashButton() {
	return (
		<>
			<button className={styles.trashButton}>
				<BiTrashAlt />
			</button>
		</>
	);
}
