'use client';
import React, { } from 'react';
import { Col, Row } from 'antd';
import Image from 'next/image';
import './style.css'
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
import FaqSection from '@/components/FaqSection';
import Features from '@/components/Features';
import Link from 'next/link';
export default function Home() {
	// const { user, logout } = useContext(AuthContext);

	// useEffect(() => {
	// 	async function registerAndSubscribe() {
	// 		try {
	// 			const serviceWorkerReg = await regSw();
	// 			await subscribe(serviceWorkerReg);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	}
	// 	registerAndSubscribe();
	// }, []);

	return (

		<>
			<div>
				<div className='bannerImages'>
					<div className='customContainer'>
						<Row>
							<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
								<div className='textSection'>
									<Titles level={2} color='primaryColor'>Find Your Perfect Study Buddy Today!</Titles>
									<div className='gapPaddingTopOTwo'></div>
									<ParaText size='medium' color='primaryColor'>
										StudyBuddy is your one-stop platform designed to enhance your college experience. Join our community of learners to connect with study partners who share your interests and goals. Improve your skills, stay motivated, and make learning more fun with a study buddy.
									</ParaText>
									<div className='gapPaddingTopOTwo'></div>
									<Link href='/en/contact'>
										<button className="button-67" role="button">Get Started</button>
									</Link>
								</div>
							</Col>
							<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
								<div className='bannerImage'>
									<Image src='/images/imgpsh_fullsize_anim (5).png' layout='responsive' alt='Study Buddy Banner' width={800} height={700} />
								</div>
							</Col>
						</Row>
					</div>

				</div>
			</div>
			<Features />
			<FaqSection />

		</>
	);
}
