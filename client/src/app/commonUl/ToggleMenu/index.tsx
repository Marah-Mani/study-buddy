'use client';
import React, { useState } from 'react';
import styles from './toggleMenu.module.css';
import { Col, Image, Row } from 'antd';
import { FiBell } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { HiMenu } from 'react-icons/hi';
import { Badge } from 'antd';
const ToggleMenu = () => {
	const [isMenuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setMenuOpen(false);
	};

	return (
		<>
			<div className={styles['headerMobile']}>
				<div className="mainContainer">
					<Row align="middle" gutter={[16, 16]}>
						<Col xs={3}>
							<button className={styles['toggleButton']} onClick={toggleMenu}>
								{isMenuOpen ? <IoMdClose /> : <HiMenu />}
							</button>
						</Col>
						<Col xs={15}>
							<Image src="/images/logomobile.png" alt="" />
						</Col>
						<Col xs={3}>
							<Badge dot className={`${styles['badgeStyle']}`} status="error">
								<FiBell />
							</Badge>
						</Col>
						<Col xs={3}></Col>
					</Row>

					{isMenuOpen && <div></div>}
				</div>
			</div>
		</>
	);
};

export default ToggleMenu;
