import React from 'react';
import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

// Assuming you're using ReactOwlCarousel as dynamic import
// const ReactOwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

interface SliderProps {
	items?: number;
	dots?: boolean;
	nav?: boolean;
	loop?: boolean;
	autoWidth?: boolean;
	className?: string;
	children: React.ReactNode;
	responsive?: any; // Update this to a specific type if possible
	startPosition?: number; // Specify the type as number
}

export default function Slider({
	className = '',
	autoWidth = false,
	children,
	responsive,
	items = 4,
	dots = true,
	nav = false,
	loop = true,
	startPosition = 0
}: SliderProps) {
	return (
		<>
			{/* <ReactOwlCarousel
				responsive={responsive}
				className={`owl-theme ${className}`}
				items={items}
				loop={loop}
				dots={dots}
				autoWidth={autoWidth}
				margin={20}
				nav={nav}
				startPosition={startPosition}
				style={{
					zIndex: 0
				}}
			>
				{children}
			</ReactOwlCarousel> */}
		</>
	);
}
