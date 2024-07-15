'use client';
import React, { useEffect, useState } from 'react';
import './style.css';
import { Drawer } from 'antd';
import { Col, Row } from 'antd';
import { TiThMenu } from "react-icons/ti";
import Link from 'next/link';
import ParaText from '@/app/commonUl/ParaText';
import { useParams, usePathname } from 'next/navigation';
import Titles from '@/app/commonUl/Titles';

export default function Header() {
	const [open, setOpen] = useState(false);
	const params = usePathname();
	const [activeIndex, setActiveIndex] = useState(0);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		switch (params) {
			case '/':
				setActiveIndex(0);
				break;
			case '/en/about':
				setActiveIndex(1);
				break;
			case '/en/contact':
				setActiveIndex(2);
				break;
			case '/en/login':
				setActiveIndex(3);
				break;
			default:
				setActiveIndex(0);
				break;
		}
	}, [params]);

	const handleClick = (index: any) => {
		setActiveIndex(index);
	};
	return (
		<>
			<header className='headerSection'>
				<div className="customContainer" id="customContainer">
					<Row align="middle" gutter={[16, 16]}>
						<Col xl={12} md={12} xs={0} sm={0}>
							<ul className="listItem nav">
								<li>
									<Link href="/" onClick={() => handleClick(0)} className={activeIndex === 0 ? 'active' : ''}>
										<ParaText size="small" fontWeightBold={500} color="primaryColor">
											Home
										</ParaText>
									</Link>
								</li>
								<li>
									<Link href="/en/about" onClick={() => handleClick(1)} className={activeIndex === 1 ? 'active' : ''}>
										<ParaText size="small" fontWeightBold={500} color="primaryColor">
											About us
										</ParaText>
									</Link>
								</li>
								<li>
									<Link href="/en/contact" onClick={() => handleClick(2)} className={activeIndex === 2 ? 'active' : ''}>
										<ParaText size="small" fontWeightBold={500} color="primaryColor">
											Contact us
										</ParaText>
									</Link>
								</li>
							</ul>

						</Col>
						<Col xl={6} md={6} xs={0} sm={0} >

							{/* <Link href="/">
								{params.includes('login') || params.includes('about') ? (
									null
								) : (
									<img src='/images/logo.png' alt='Logo Site' className='logoSite' />
								)}
							</Link> */}
							<Link href="/">
								{params.includes('login') || params.includes('register') || params.includes('forgot-password') ? (
									null
								) : (
									<Link href="/">
										<Titles level={4} color='primaryColor'>StudyBuddy</Titles>
									</Link>
								)}
							</Link>
						</Col>
						<Col xl={6} md={6} xs={0} sm={0} className='textEnd nav' >
							<li style={{ padding: '0px' }}>
								<Link href="/en/login" onClick={() => handleClick(3)} className={activeIndex === 3 ? 'active' : ''}>
									<ParaText size="small" fontWeightBold={500} color="primaryColor">Login</ParaText>
								</Link>
							</li>
						</Col>
					</Row>

					<Row align='middle'>
						<Col xl={0} md={0} xs={18} sm={12} >
							<Link href="/">
								<Link href="/">
									{/* <Titles level={3} color="primaryColor">StudyBuddy</Titles> */}
									<img src='/images/logo.png' alt='Logo Site' className='logoSite' />
								</Link>
							</Link>
						</Col>
						<Col xl={0} md={0} xs={6} sm={12} className='textEnd'>
							<TiThMenu onClick={showDrawer} size={25} color='#F1A638' />
						</Col>
					</Row>

					<Drawer title="" onClose={onClose} open={open} placement='left' className="textCenter">
						<Link href="/" onClick={onClose}>
							{/* <Titles level={3} color="primaryColor">StudyBuddy</Titles> */}
							<img src='/images/logo.png' alt='Logo Site' className='logoSite' />
						</Link>
						<br />
						<br />
						<ul className="textCenter nav">
							<li>
								<Link href="/" onClick={onClose}>
									<ParaText size="small" color="primaryColor">Home</ParaText>
								</Link>
							</li>
							<br />
							<br />
							<li>
								<Link href="/en/about" onClick={onClose}>
									<ParaText size="small" color="primaryColor">About us</ParaText></Link>
							</li>
							<br />
							<br />
							<li>
								<Link href="/en/contact" onClick={onClose}>
									<ParaText size="small" color="primaryColor">Contact us</ParaText>
								</Link>
							</li>
							<br />
							<br />
							<li>
								<Link href="/en/login" onClick={onClose}>
									<ParaText size="small" color="primaryColor">Login</ParaText>
								</Link>
							</li>
							<br />
							<br />
						</ul>
					</Drawer>
				</div>
			</header >
		</>
	);
}
