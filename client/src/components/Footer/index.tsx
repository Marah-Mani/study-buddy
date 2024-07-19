'use client';
import React, { } from 'react';
import './style.css';
import { MdMailOutline } from "react-icons/md";
import ParaText from '@/app/commonUl/ParaText';
import { Col, Row } from 'antd';
import Titles from '@/app/commonUl/Titles';

export default function Footer() {
	return (
		<>
			<section className='footerSection'>
				<footer className="footer">
					<div className="customContainer">
						<Row align='middle' className="row">
							<Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16} className="footer-col leftBar " >
								<img src='/images/logo.png' className='logoSite' alt='Logo Site' />
								<div className='gapMarginTopTwo'></div>
								<div className='flexBarMail'
								> <MdMailOutline color='#F1A638' />
									<ParaText fontWeightBold={600} size='extraSmall' color='white'> Study24Buddyy@gmail.com</ParaText>
								</div>
								<div className='gapMarginTopTwo'></div>
							</Col>
							<Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} className="footer-col navBar">
								<ul>
									<li><ParaText fontWeightBold={900} size='medium' color='primaryColor'>Navigation</ParaText></li>
									<li><a href="/en/about"> <ParaText fontWeightBold={500} size='small' color='primaryColor'>About Us</ParaText></a></li>
									<li><a href="/en/contact"> <ParaText fontWeightBold={500} size='small' color='primaryColor'>Contact Us</ParaText> </a></li>
									<li><a href="/en/privacy"> <ParaText fontWeightBold={500} size='small' color='primaryColor'> Privacy Policy</ParaText></a></li>
									<li><a href="/en/terms"> <ParaText fontWeightBold={500} size='small' color='primaryColor'>Terms of Use</ParaText> </a></li>
								</ul>
							</Col>

						</Row>
					</div>
				</footer>
			</section>
		</>
	);
}
