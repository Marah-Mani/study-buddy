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
import { getSingleProduct } from '@/lib/adminApi';
export default function Dashboard() {
	const [open, setOpen] = useState(false);
	const [reload, setReload] = useState(false);
	const [editData, setEditData] = useState<any>([]);
	const [searchInput, setSearchInput] = useState('')

	const showDrawer = () => {
		setOpen(true);
		setEditData({});

	};
	const onClose = () => {
		setOpen(false);
	};

	const handleSuccess = () => {
		setOpen(false);
		setReload(!reload);
	};

	const handleEdit = async (id: any) => {
		setOpen(true);
		const res = await getSingleProduct(id);
		if (res.status == true) {
			setEditData(res.data);
		}
	}

	return (
		<>
			<div className='dashBody gapMarginTop'>
				<div className='gapMarginTopTwo'></div>
				<Row align='middle' gutter={[16, 16]}>
					<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
						<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
							Products
						</ParaText>
					</Col>
					<Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
						<Space>
							<Input placeholder="Search" style={{ height: '38px', width: '100%' }} className='buttonClass' onChange={(e) => setSearchInput(e.target.value)} />
							<Button style={{ height: '38px', width: '100%' }} className='buttonClass' type='primary' onClick={showDrawer}>Add Product</Button>
						</Space>

					</Col>
				</Row>
				<div className='gapMarginTopTwo'></div>
				<TableData searchInput={searchInput} reload={reload} onEdit={(id: any) => { handleEdit(id) }} />
			</div>

			<Drawer title="Add Product" onClose={onClose} open={open} width={600}>
				<FormType onSuccess={handleSuccess} editData={editData} />
			</Drawer>
		</>
	);
}
