'use client';
import React, { } from 'react';
import { Col, Image, Row } from 'antd';
import './style.css'
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
export default function page() {
	return <>
		<section className='innerBannerAbout'>
			<div className='customContainer'>
				<Row gutter={[24, 24]} align='middle'>
					<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textCenter'>
						<div className="contact-info">
							<Image src="/images/logo-.png" alt="" preview={false} />
						</div>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
						<div className=''>
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
