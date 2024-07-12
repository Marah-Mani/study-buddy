'use client';
import React from 'react';
import { Col, Row } from 'antd';
import Image from 'next/image';
import './style.css';
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
				<div className="bannerImages">
					<div className="waves">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
							<path
								fill="#f1a638"
								fill-opacity="1"
								d="M0,320L20,282.7C40,245,80,171,120,154.7C160,139,200,181,240,176C280,171,320,117,360,96C400,75,440,85,480,96C520,107,560,117,600,106.7C640,96,680,64,720,58.7C760,53,800,75,840,96C880,117,920,139,960,128C1000,117,1040,75,1080,80C1120,85,1160,139,1200,165.3C1240,192,1280,192,1320,165.3C1360,139,1400,85,1420,58.7L1440,32L1440,0L1420,0C1400,0,1360,0,1320,0C1280,0,1240,0,1200,0C1160,0,1120,0,1080,0C1040,0,1000,0,960,0C920,0,880,0,840,0C800,0,760,0,720,0C680,0,640,0,600,0C560,0,520,0,480,0C440,0,400,0,360,0C320,0,280,0,240,0C200,0,160,0,120,0C80,0,40,0,20,0L0,0Z"
							></path>
						</svg>
					</div>
					<div className="customContainer">
						<Row>
							<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
								<div className="textSection">
									<Titles level={2} color="primaryColor">
										Find Your Perfect Study Buddy Today!
									</Titles>
									<div className="gapPaddingTopOTwo"></div>
									<ParaText size="medium" color="primaryColor">
										StudyBuddy is your one-stop platform designed to enhance your college
										experience. Join our community of learners to connect with study partners who
										share your interests and goals. Improve your skills, stay motivated, and make
										learning more fun with a study buddy.
									</ParaText>
									<div className="gapPaddingTopOTwo"></div>
									<Link href="/en/contact">
										<button className="button-67" role="button">
											Get Started
										</button>
									</Link>
								</div>
							</Col>
							<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
								<div className="bannerImage">
									<Image
										src="/images/imgpsh_fullsize_anim (5).png"
										layout="responsive"
										alt="Study Buddy Banner"
										width={800}
										height={700}
									/>
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
