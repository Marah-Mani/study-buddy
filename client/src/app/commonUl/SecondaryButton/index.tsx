import React from 'react';
import './style.css';
import { Button } from 'antd';

interface SecondaryButtonProps {
	label?: string;
	className?: string;
	children?: React.ReactNode;
	showIcon?: boolean;
	icon?: any;
	color?: string;
	loading?: boolean;
	disabled?: boolean;
	borderRadius?: number;
	background?: string;
	height?: number;
	width?: number | string;
	fontSize?: number;
	fontWeight?: number;
	onClick?: (() => void) | undefined;
	type?: 'primary' | 'secondary' | 'default' | 'danger' | 'yellow' | 'gray' | 'transparent';
	htmlType?: 'button' | 'submit' | 'reset';
}

export default function SecondaryButton({
	label,
	type = 'primary',
	className = '',
	children,
	height,
	background,
	width = '100%', // Set default width to 100%
	borderRadius = 8,
	color,
	icon,
	loading = false,
	disabled = false,
	htmlType = 'button',
	fontWeight = 500,
	onClick
}: SecondaryButtonProps) {
	return (
		<div className="primaryWrapper">
			<Button
				onClick={onClick}
				htmlType={htmlType}
				loading={loading}
				disabled={disabled}
				className={`${className}`}
				style={{
					fontWeight: fontWeight,
					fontSize: '12px',
					width: width === '100%' ? width : `${width}px`, // Adjust width for desktop view
					height: `${height}px`,
					padding: '0px 20px',
					color: `${color
						? color
						: type === 'primary'
							? '#FFFFFF'
							: type === 'secondary'
								? '#0055BA'
								: type === 'gray'
									? '#fff'
									: type === 'default'
										? '#0F43E6'
										: type === 'yellow'
											? '#012A59'
											: type === 'danger'
												? '#fff'
												: type === 'transparent'
													? '#484848'
													: ''
						}`,
					background: `${background
						? background
						: type === 'primary'
							? '#0091F7'
							: type === 'secondary'
								? '#0055BA14'
								: type === 'gray'
									? '#407BFF'
									: type === 'default'
										? '#FFFFFF'
										: type === 'yellow'
											? '#FFE70F'
											: type === 'danger'
												? '#D73131'
												: type === 'transparent'
													? '#fff0'
													: ''
						}`,
					borderRadius: `${borderRadius}px`
				}}
			>
				{icon} {label || children}
			</Button>
		</div>
	);
}
