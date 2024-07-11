'use client';
import React, { useState } from 'react';
import './style.css';
import { Drawer } from 'antd';
import { Col, Row } from 'antd';
import { TiThMenu } from "react-icons/ti";
import Link from 'next/link';
import ParaText from '@/app/commonUl/ParaText';
import { useParams, usePathname } from 'next/navigation';

export default function Header() {
	const [open, setOpen] = useState(false);
	const params = usePathname();

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};
	const [activeIndex, setActiveIndex] = useState(null);

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
								{[
									{ href: "/", label: "Home" },
									{ href: "/en/about", label: "About us" },
									{ href: "/en/contact", label: "Contact us" },
								].map((item, index) => (
									<li key={index} >
										<Link href={item.href} onClick={() => handleClick(index)} className={activeIndex === index ? 'active' : ''}>
											<ParaText size="small" fontWeightBold={500} color="primaryColor">
												{item.label}
											</ParaText>
										</Link>
									</li>
								))}
							</ul>
						</Col>
						<Col xl={6} md={6} xs={0} sm={0} >
							<Link href="/">
								{/* <Titles level={3} color="primaryColor">Study Buddy</Titles> */}
								{params == '/en/login'
									?
									''
									:
									<img src='/images/logo.png' alt='Logo Site' className='logoSite' />
								}
							</Link>
						</Col>
						<Col xl={6} md={6} xs={0} sm={0} className='textEnd' >
							<Link href="/en/login">
								<ParaText size="small" fontWeightBold={500} color="primaryColor">Login</ParaText>
							</Link>
						</Col>
					</Row>

					<Row align='middle'>
						<Col xl={0} md={0} xs={18} sm={12} >
							<Link href="/">
								<Link href="/">
									{/* <Titles level={3} color="primaryColor">Study Buddy</Titles> */}
									<img src='/images/logo.png' alt='Logo Site' className='logoSite' />
								</Link>
							</Link>
						</Col>
						<Col xl={0} md={0} xs={6} sm={12} className='textEnd'>
							<TiThMenu onClick={showDrawer} size={25} color='#F1A638' />
						</Col>
					</Row>

					<Drawer title="" onClose={onClose} open={open} placement='left' className="textCenter">
						<Link href="/">
							<Link href="/">
								{/* <Titles level={3} color="primaryColor">Study Buddy</Titles> */}
								<img src='/images/logo.png' alt='Logo Site' className='logoSite' />
							</Link>
						</Link>
						<br />
						<br />
						<ul className="textCenter nav">
							<li>
								<Link href="/">
									<ParaText size="small" color="primaryColor">Home</ParaText>
								</Link>
							</li>
							<br />
							<br />
							<li>
								<Link href="/en/about">
									<ParaText size="small" color="primaryColor">About us</ParaText></Link>
							</li>
							<br />
							<br />
							<li>
								<Link href="/en/contact">
									<ParaText size="small" color="primaryColor">Contact us</ParaText>
								</Link>
							</li>
							<br />
							<br />
							<li>
								<Link href="/en/login">
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
