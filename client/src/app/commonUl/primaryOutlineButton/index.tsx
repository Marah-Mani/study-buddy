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
	fontSize?: number;
	onClick?: () => void;
	type?: string;
}

export default function PrimaryOutlineButton({ label, className = '', children, onClick, type, icon }: SecondaryButtonProps) {
	return (
		<div className="primaryOutlineButton">
			<button onClick={onClick} className={` ${className}`} id="w100">
				{label || children}
			</button>
		</div>
	);
}
