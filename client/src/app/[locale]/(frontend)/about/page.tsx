'use client';
import React, { } from 'react';
import { Col, Image, Row } from 'antd';
import './style.css'
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
export default function page() {
	return <>
		<section className='innerBannerAbout'>
			<div className="waves">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<path fill="#f1a638" fill-opacity="1" d="M0,96L30,112C60,128,120,160,180,160C240,160,300,128,360,122.7C420,117,480,139,540,149.3C600,160,660,160,720,149.3C780,139,840,117,900,112C960,107,1020,117,1080,144C1140,171,1200,213,1260,202.7C1320,192,1380,128,1410,96L1440,64L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
				</svg>
			</div>
			<div className='customContainer'>
				<Row gutter={[24, 24]} align='middle'>
					<Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} className='textCenter'>
						<div className="about-info">
							<img src="/images/logo.png" alt="" />
						</div>
					</Col>
					<Col xs={24} sm={24} md={24} lg={16} xl={16} xxl={16}>
						<div className='about-info about-remove'>
							<Titles level={1} color='primaryColor'>Who we are</Titles>
							<div className='gapPaddingTopOTwo'></div>
							<ParaText size='medium' color='primaryColor'>Welcome to StudyBuddy, where college success meets community collaboration. Our platform simplifies your academic journey by offering real-time study groups, a marketplace for textbooks and gadgets, and expert help through our Q&A forum-all in one place. Created by students, for students, StudyBuddy fosters a supportive environment where you can connect with peers, share knowledge, and thrive together. Join us and experience how StudyBuddy enhances learning, simplifies study sessions, and connects you with a vibrant community of learners.
							</ParaText>
						</div>
					</Col>

				</Row>
			</div>
		</section>


	</>;
}
