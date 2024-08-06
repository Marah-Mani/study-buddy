'use client';

import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import MenuAdmin from '@/app/commonUl/MenuAdmin';
import TopBar from '@/app/commonUl/topBar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const segments = pathname.split('/').filter(Boolean);
	const desiredSegment = segments[segments.length - 1]; // Get the last segment
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
	const [isIPhone, setIsIPhone] = useState(false);
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 767);
			setIsIPhone(/iPhone/i.test(navigator.userAgent));
			console.log(`isMobile: ${window.innerWidth <= 767}`);
			console.log(`isIPhone: ${/iPhone/i.test(navigator.userAgent)}`);
		};

		// Initial check
		handleResize();

		// Event listener for window resize
		window.addEventListener('resize', handleResize);

		// Cleanup function to remove event listener
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	useEffect(() => {
		const enterFullscreen = () => {
			console.log("Attempting to enter fullscreen...");
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen().catch((err) => {
					console.error("Error attempting to enable full-screen mode:", err);
					if (isIPhone) {
						console.log("Hiding Safari toolbar on iPhone...");
						// Hide browser toolbar on iPhone
						window.scrollTo(0, 1);
					} else {
						console.log("Hiding browser toolbar on desktop...");
						// Hide browser toolbar on desktop
						window.scrollTo(0, 0);
					}
				});
			} else {
				console.log("Fullscreen API is not supported.");
			}
		};

		const exitFullscreen = () => {
			console.log("Attempting to exit fullscreen...");
			if (document.exitFullscreen) {
				document.exitFullscreen().catch((err) => {
					console.error("Error attempting to exit full-screen mode:", err);
				});
			} else {
				console.log("Fullscreen API is not supported.");
			}
		};

		if (desiredSegment === 'chat' && isMobile) {
			console.log("Desired segment is 'chat' and is mobile.");
			// Ensure fullscreen request is handled with user interaction
			const handleFullscreenRequest = () => {
				setTimeout(enterFullscreen, 100); // Slight delay to ensure rendering
			};

			handleFullscreenRequest();

			// Add event listener to handle user interaction
			document.addEventListener('click', handleFullscreenRequest, { once: true });

			// Cleanup event listener
			return () => {
				document.removeEventListener('click', handleFullscreenRequest);
			};
		} else if (desiredSegment !== 'chat') {
			console.log("Desired segment is not 'chat'. Exiting fullscreen if needed.");
			// Exit fullscreen if not 'chat'
			exitFullscreen();
		}
		return undefined;
	}, [desiredSegment, isMobile, isIPhone]);

	return (
		<>
			{desiredSegment === 'chat' ? (
				<>
					<TopBar />
					<div className='chatMan'>
						<div className='leftChatBar'>
							<div className="largeTopMargin"></div>
							<MenuAdmin />
						</div>
						<div className='rightChatBar'>
							<div className="">{children}</div>
						</div>
					</div>
				</>
			) : (
				<section>
					<TopBar />
					<div className="largeTopMargin"></div>
					<Row className="myRow">
						<div className="largeTopMargin"></div>
						<Col sm={24} xs={24} md={24} lg={24} xl={4} xxl={4} className="mobileNone">
							<MenuAdmin />
						</Col>
						<Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={20}>
							<div className="layOutStyle chat-remove">{children}</div>
						</Col>
					</Row>
				</section>
			)}
		</>
	);
}
