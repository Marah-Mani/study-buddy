'use client';
import React, { } from 'react';
import { Col, Image, Row } from 'antd';
import { Carousel } from 'antd';
import './style.css'
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
import FaqSection from '@/components/FaqSection';
import Features from '@/components/Features';
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
			<Carousel arrows infinite={false} >
				<div>
					<div className='bannerImages'>
						<div className='customContainer'>
							<div className='textSection'>
								<Titles level={2} color='white'>Find Your Perfect Study Buddy Today!</Titles>
								<ParaText size='medium' color='white'>StudyBuddy is your one-stop platform designed to enhance your college experience. Join our community of learners to connect with study partners who share your interests and goals. Improve your skills, stay motivated, and make learning more fun with a study buddy.
								</ParaText>
								<br />
								<button className="button-67" role="button">Get Started Now</button>
							</div>
						</div>
					</div>
				</div>
			</Carousel>


			{/*
			<section className='innerBanner'>
				<div className='customContainer'>
					<Row align='middle'>
						<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
							<div className='progress_bar-Section'>
								<Titles level={3} color='black'>About Our Skills</Titles>
								<br />
								<ParaText size='extraSmall' color='black'>Sorem ipsum dolor sit amet consectetur adipisicing elit, sed do eiusmod temin cididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerci tation ullamco laboris nisi ut aliquip ex ea commodo consequat.
								</ParaText>

								<div className="progress_bar">
									<div className="pro-bar">
										<small className="progress_bar_title">
											Digital Teaching
											<span className="progress_number">89%</span>
										</small>
										<span className="progress-bar-inner" style={{ backgroundColor: '#1abc9c', width: '89%' }} data-value={89} data-percentage-value={89} />
									</div>
								</div>
								<div className="progress_bar">
									<div className="pro-bar">
										<small className="progress_bar_title">
											Well Known Result
											<span className="progress_number">75%</span>
										</small>
										<span className="progress-bar-inner" style={{ backgroundColor: '#fdba04', width: '75%' }} data-value={75} data-percentage-value={75} />
									</div>
								</div>
								<div className="progress_bar">
									<div className="pro-bar">
										<small className="progress_bar_title">
											Marketing
											<span className="progress_number">75%</span>
										</small>
										<span className="progress-bar-inner" style={{ backgroundColor: '#1967D2', width: '75%' }} data-value={75} data-percentage-value={75} />
									</div>
								</div>
							</div>
						</Col>
						<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textCenter'>
							<div>
								<Image preview={false} src='https://wphix.com/template/sikkha-prv/sikkha/img/about/about-right002.png' alt='' />
							</div>
						</Col>
					</Row>
				</div>
			</section> */}

			<Features />
			<FaqSection />

		</>
	);
}
