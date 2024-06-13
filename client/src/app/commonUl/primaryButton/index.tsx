import React from 'react';
import './style.css';
interface SecondaryButtonProps {
	label?: string;
	className?: string;
	icon?: any;
	children?: React.ReactNode;
	showIcon?: boolean;
	color?: string;
	background?: string;
	height?: number;
	type?: string;
	fontSize?: number;
	onClick?: () => void;
}

export default function PrimaryButton({ label, className = '', children, onClick, icon, type }: SecondaryButtonProps) {
	return (
		<div className="PrimaryButton">
			<button onClick={onClick} className={` ${className}`} id="w100">
				{label || children}
			</button>
		</div>
	);
}
