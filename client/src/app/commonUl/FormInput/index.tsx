import React from 'react';
import { Input } from 'antd';
import styles from './formInput.module.css';

interface FormInputProps {
	disabled?: boolean;
	prefix?: any;
	className?: string;
	suffix?: any;
	height?: number;
	background?: string;
	color?: string;
	border?: string; // Change type to string
	placeHolder?: string;
	type?: any;
	value?: string;
	maxLength?: number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
	prefix,
	className,
	suffix,
	height = 40,
	background,
	color = '#8897AD',
	border, // Set default value to 'none'
	type = 'any',
	placeHolder,
	value,
	maxLength,
	disabled = false,
	onChange
}: FormInputProps) {
	return (
		<div className={styles['inputWithIcon']}>
			<Input
				className={className}
				prefix={prefix}
				suffix={suffix}
				style={{
					height: `${height}px`,
					background: `${background}`,
					border: border
				}}
				type={type}
				color={color}
				placeholder={placeHolder}
				value={value}
				maxLength={maxLength}
				onChange={onChange}
				disabled={disabled}
			/>
		</div>
	);
}
