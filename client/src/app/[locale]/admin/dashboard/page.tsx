'use client';
import React, { useState } from 'react';
import './style.css'
import ParaText from '@/app/commonUl/ParaText';
import { Button, Col, Form, Image, Input, Rate, Row, Segmented, Space, Tag } from 'antd';
import { CiHeart } from "react-icons/ci";
import { FaShoppingCart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { TbArrowsRandom } from "react-icons/tb";
import { Drawer } from 'antd';
import FormType from './FormType';
import TableData from './TableData';
export default function Dashboard() {
	const [open, setOpen] = useState(false);

	const showDrawer = () => {
		setOpen(true);
	};
	const onClose = () => {
		setOpen(false);
	};
	return (
		<>
			<div className='dashBody gapMarginTop'>
				<div className="">
					<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
						Product
					</ParaText>
				</div>
				<div className='gapMarginTopTwo'></div>
				<Row align='middle' gutter={[16, 16]}>
					<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
						<Segmented
							options={['Men', 'Women', 'Today Deals', 'Home & Kitchen', 'Customer Service']}
							onChange={(value) => {
								console.log(value); // string
							}}
						/>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
						<Space>
							<Input placeholder="Search" style={{ height: '38px', width: '100%' }} className='buttonClass' />
							<Button style={{ height: '38px', width: '100%' }} className='buttonClass' type='primary'>Search</Button>
							<Button style={{ height: '38px', width: '100%' }} className='buttonClass' type='primary' onClick={showDrawer}>Add Product</Button>
						</Space>

					</Col>
				</Row>
				<div className='gapMarginTopTwo'></div>
				<Row>
					<Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={5} >
						<div className="product-grid">
							<div className="product-image">
								<a href="#" className="image">
									<Image className="pic-1" alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" />
								</a>
								<ul className="social">
									<li><a href="#" data-tip="Quick View"><CiSearch /></a></li>
									<li><a href="#" data-tip="Compare"><TbArrowsRandom /></a></li>
									<li><a href="#" data-tip="Wishlist"><CiHeart /></a></li>
									<li><a href="#" data-tip="Add to cart"><FaShoppingCart /></a></li>
								</ul>
							</div>

							<Row align='middle'>
								<Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
									<div className="product-content">
										<ParaText size='textGraf' className="title" fontWeightBold={600}><a href="#">Dapzem & Co</a></ParaText>
										<ParaText size='smallExtra' className="price dBlock">Branded hoodie ethnic style</ParaText>
									</div>
								</Col>
								<Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
									<Rate allowHalf defaultValue={2.5} />
								</Col>
							</Row>
							<Row align='middle'>
								<Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
									<div className="product-content">
										<div className="price">$25.00 <span>$33.00</span></div>
										<div className='gapMarginTopOne'></div>
										<ParaText size='smallExtra' className="title "><a href="#"> <Tag color="green">Offer Price $229</Tag></a></ParaText>
									</div>
								</Col>
								<Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
									<Tag color="geekblue">72% off</Tag>
								</Col>
							</Row>
						</div>
					</Col>
				</Row>
				<TableData />
			</div>

			<Drawer title="Add Product" onClose={onClose} open={open} width={600}>
				<FormType />
			</Drawer>
		</>
	);
}
