import { Button, Col, Radio, Row, Typography } from 'antd';
import React from 'react';
import './paymentCard.css';
import Image from 'next/image';
import { PlusOutlined } from '@ant-design/icons';

export default function PaymentCard({ card, onChange, checked }: any) {
	const handleClick = () => {
		onChange()
	}
	return (
		<Row>
			<Col xxl={24} xl={24} lg={24} md={24} sm={24} xs={24} onClick={handleClick}>
				<Row align={'middle'} justify={'space-between'} className="radio">
					<Col style={{ display: 'flex', alignItems: 'center' }}>
						<Radio onChange={onChange} checked={checked}></Radio>
						{card?.brand ? (
							<Image src={`/cards/${card?.brand}.svg`} width={50} height={50} alt="" />
						) : (
							<Button type="dashed">
								<PlusOutlined />
							</Button>
						)}
					</Col>
					<Col style={{ textAlign: 'end' }}>
						{card?.brand ? (
							<>
								<p>**** **** **** {card?.last4}</p>
								<p>{card?.brand}</p>
							</>
						) : (
							<>
								<p style={{ color: '$ccc', fontWeight: 600 }}>
									<PlusOutlined /> Add new card
								</p>
								<p>Save & pay with a new card</p>
							</>
						)}
					</Col>
				</Row>
			</Col>
		</Row>
	);
}
