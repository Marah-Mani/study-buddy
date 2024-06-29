'use client';
import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface CustomTextProps {
	size?: 'large' | 'medium' | 'small' | 'extraSmall' | 'textGraf' | 'smallExtra' | 'minSmall';
	className?: any;
	fontWeightBold?: number;
	style?: any;
	title?: any;
	children?: React.ReactNode;
	color?: 'defaultColor' | 'primaryColor' | 'secondaryColor' | 'white' | 'black' | 'blueLight';
}

const ParaText = ({
	className = '',
	children,
	size = 'large',
	color = 'defaultColor',
	fontWeightBold = 400,
	title = ''
}: CustomTextProps) => {
	const [fontSize, setFontSize] = useState<number>(16);
	const [fontWeight, setFontWeight] = useState<number>(400);

	useEffect(() => {
		const updateStyles = () => {
			const screenWidth = window.innerWidth;

			setFontSize(
				size === 'large'
					? screenWidth > 767
						? 21
						: 14
					: size === 'medium'
						? screenWidth > 767
							? 20
							: 14
						: size === 'small'
							? screenWidth > 767
								? 18
								: 14
							: size === 'extraSmall'
								? screenWidth > 767
									? 16
									: 14
								: size === 'textGraf'
									? screenWidth > 767
										? 14
										: 12
									: size === 'smallExtra'
										? screenWidth > 767
											? 12
											: 12
										: size === 'minSmall'
											? screenWidth > 767
												? 10
												: 10
											: screenWidth > 767
												? 16
												: 16
			);

			setFontWeight(
				fontWeightBold ? fontWeightBold : size === 'large' ? (screenWidth > 767 ? fontWeightBold : 400) : 400
			);
		};

		updateStyles();

		window.addEventListener('resize', updateStyles);

		return () => {
			window.removeEventListener('resize', updateStyles);
		};
	});

	return (
		<>
			<Text
				title={title}
				className={className}
				style={{
					fontSize,
					fontWeight,
					color: `${color == 'defaultColor'
						? '#E7D1B5'
						: color == 'primaryColor'
							? '#f1a638'
							: color == 'secondaryColor'
								? '#344734'
								: color == 'white'
									? '#fff'
									: color == 'black'
										? '#222529'
										: color
						}`
				}}
			>
				{children}
			</Text>
		</>
	);
};

export default ParaText;
