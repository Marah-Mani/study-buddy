'use client';
import React, { } from 'react';
import './style.css';

import { SiFacebook } from 'react-icons/si';
import { FaTwitter, FaYoutube } from 'react-icons/fa6';
import { PiInstagramLogoFill } from 'react-icons/pi';
import ParaText from '@/app/commonUl/ParaText';

export default function Footer() {
	return (
		<>


			<section className='footerSection'>
				<footer className="footer">
					<div className="customContainer">
						<div className="row">
							<div className="footer-col leftBar">
								<h4>follow us</h4>
								<div className='gapMarginTopTwo'></div>
								<ParaText size='extraSmall' color='white' className='dBlock'>Study Buddy is dedicated to helping students connect with like-minded peers for collaborative learning.</ParaText>
								<div className='gapMarginTopTwo'></div>
								<div className="social-links">
									<a href="#">
										<SiFacebook />
									</a>
									<a href="#">
										<FaTwitter />
									</a>
									<a href="#">
										<PiInstagramLogoFill />
									</a>
									<a href="#">
										<FaYoutube />
									</a>
								</div>
							</div>
							<div className="footer-col">
								<h4>navigation</h4>
								<ul>
									<li><a href="/en/contact">Contact Us</a></li>
									<li><a href="/en/privacy">Privacy Policy</a></li>
									<li><a href="/en/terms">Terms of Use</a></li>
								</ul>
							</div>
						</div>
						<br />
						<br />
						<div className='textEnd'>
							<ParaText size='extraSmall' color='white'>Copyright © Study Buddy all rights reserved.</ParaText>
						</div>
					</div>

				</footer>

			</section>
		</>
	);
}
