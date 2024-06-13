'use client';
import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

interface HProps {
	level?: 1 | 2 | 3 | 4 | 5;
	className?: any;
	content?: any;
	title?: any;
	children?: React.ReactNode;
	color?: 'defaultColor' | 'white' | 'SecondaryColor' | 'PrimaryColor' | 'yellowText' | 'black';
}

const Titles = ({ level = 1, content, children, className = '', color = 'defaultColor', title = '' }: HProps) => {
	const [fontSize, setFontSize] = useState<number>(0);
	const [fontWeight, setFontWeight] = useState<number>(0);

	useEffect(() => {
		const updateStyles = () => {
			const screenWidth = window.innerWidth;

			setFontSize(
				level === 1
					? screenWidth > 767
						? 80
						: 30
					: level === 2
						? screenWidth > 767
							? 60
							: 16
						: level === 3
							? screenWidth > 767
								? 48
								: 16
							: level === 4
								? screenWidth > 767
									? 30
									: 12
								: level === 5
									? screenWidth > 767
										? 24
										: 12
									: screenWidth > 767
										? 16
										: 10
			);

			setFontWeight(level === 1 ? (screenWidth > 767 ? 600 : 600) : 600);
		};

		updateStyles();

		window.addEventListener('resize', updateStyles);

		return () => {
			window.removeEventListener('resize', updateStyles);
		};
	}, [level]);

	return (
		<>
			<Title
				title={title}
				className={className}
				level={level}
				style={{
					fontSize,
					fontWeight,
					color: `${color == 'defaultColor'
						? '#4F4F4F'
						: color == 'white'
							? '#fff'
							: color == 'SecondaryColor'
								? '#0091F7'
								: color == 'PrimaryColor'
									? '#012A59'
									: color == 'black'
										? '#000'
										: color == 'yellowText'
											? '#FFE70F'
											: color
						}`
				}}
			>
				{content || children}
			</Title>
		</>
	);
};

export default Titles;
