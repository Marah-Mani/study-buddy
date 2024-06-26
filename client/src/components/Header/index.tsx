'use client';
import React, { useState, useContext, useEffect, useRef } from 'react';
import './style.css';
import { Drawer } from 'antd';
import { Button, Col, Image, Row } from 'antd';
import { TiThMenu } from "react-icons/ti";
import Link from 'next/link';
import ParaText from '@/app/commonUl/ParaText';

export default function Header() {
	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};

	const onClose = () => {
		setOpen(false);
	};

	return (
		<>
			<div className="customContainer" id="customContainer">
				<Row align="middle" gutter={[16, 16]}>
					<Col xl={6} md={6} xs={12} sm={12} className="logoMain">
						<Link href="/">
							<Image src='/home/logo.png' alt='' preview={false} />
						</Link>
					</Col>

					<Col xl={14} md={14} xs={0} sm={0} className="textEnd">
						<ul className="listItem nav">
							<li>
								<Link href="/">
									<ParaText size="extraSmall" color="black">Home</ParaText>
								</Link>
							</li>
							<li>
								<Link href="/en/about">
									<ParaText size="extraSmall" color="black">About us</ParaText></Link>
							</li>
							<li>
								<Link href="/en/contact">
									<ParaText size="extraSmall" color="black">Contact us</ParaText>
								</Link>
							</li>
							<li>
								<Link href="/en/login">
									<ParaText size="extraSmall" color="black">Login</ParaText>
								</Link>
							</li>
						</ul>
					</Col>
					<Col xl={0} md={0} xs={12} sm={12} className="textEnd">
						<TiThMenu onClick={showDrawer} size={25} />
						<Drawer title="" onClose={onClose} open={open} placement='left' className="textCenter">
							<Link href="/">
								<Image src='/home/logo.png' alt='' width={200} preview={false} />
							</Link>
							<br />
							<br />
							<ul className="textCenter nav">
								<li>
									<Link href="/">
										<ParaText size="extraSmall" color="black">Home</ParaText>
									</Link>
								</li>
								<br />
								<br />
								<li>
									<Link href="/en/about">
										<ParaText size="extraSmall" color="black">About us</ParaText></Link>
								</li>
								<br />
								<br />
								<li>
									<Link href="/en/contact">
										<ParaText size="extraSmall" color="black">Contact us</ParaText>
									</Link>
								</li>
								<br />
								<br />
								<li>
									<Link href="/en/login">
										<ParaText size="extraSmall" color="black">Login</ParaText>
									</Link>
								</li>
								<br />
								<br />
							</ul>
						</Drawer>
					</Col>
				</Row>
			</div>
		</>
	);
}
