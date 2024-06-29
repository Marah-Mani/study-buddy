'use client';
// import { SessionProvider } from 'next-auth/react';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import AuthContext from '../../contexts/AuthContext';
import AntdConfig from '@/lib/AntdConfig';
// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import Header from '../Header';
import Footer from '../Footer';
interface Props {
	children: ReactNode;
}

const Providers = (props: Props) => {
	const pathname = usePathname();

	const { user } = useContext(AuthContext);
	const [isMobile, setIsMobile] = useState(false);
	const excludedPaths = [
		'/admin',
		'/staff',
		'/login',
		'/otp',
		'/register',
		'/forgot-password',
		'/reset-password',
		'/payment'

	];

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 767);
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

	return (
		<SessionProvider>
			{excludedPaths.some((path) => pathname.includes(path)) ? null : <Header />}
			{props.children}
			{excludedPaths.some((path) => pathname.includes(path)) || isMobile ? '' : <Footer />}
		</SessionProvider>
	);
};

export default Providers;
