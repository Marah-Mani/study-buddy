'use client';
import React from 'react';
import ParaText from '../ParaText';
import Image from 'next/image';
import Titles from '../Titles';
import styles from './destinationsCard.module.css';
import { FaStar } from 'react-icons/fa6';
import { Col, Row } from 'antd';

export default function DestinationsCard() {
	return (
		<>
			<div className={styles['destinationsCard']}>
				<Image src="/images/card-img.png" alt="Your External Image" width={500} height={550} />
				<div className="starReview">
					<FaStar />
					<FaStar />
					<FaStar />
					<FaStar />
					<FaStar />
				</div>
				<div className="marginTopOne"></div>
				<Titles level={4} color="PrimaryColor">
					Gainesville
				</Titles>
				<div className="marginTopOne"></div>
				<ParaText size="medium" color="PrimaryColor">
					108 Tours <span className={styles['spacing']}> |</span> 15 Hotels
				</ParaText>
			</div>
		</>
	);
}
