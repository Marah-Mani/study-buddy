// Import necessary libraries/components
import React, { useState } from 'react';
import { Rate } from 'antd';
import styles from './rateStar.module.css';

// Define the RateStar component
interface RateStarProps {
	onRatingChange: (value: number) => void;
	value: number; // Add the 'value' prop to the interface
	disabled: boolean;
}

export default function RateStar({ onRatingChange, value, disabled }: RateStarProps) {
	// Use 'value' prop directly instead of maintaining state
	const handleRatingChange = (newValue: number) => {
		// Call the parent's callback function with the new rating value
		onRatingChange(newValue);
	};

	return (
		<>
			<div className={styles['rateStar']}>
				<Rate onChange={handleRatingChange} value={value} disabled={disabled} />
			</div>
		</>
	);
}
