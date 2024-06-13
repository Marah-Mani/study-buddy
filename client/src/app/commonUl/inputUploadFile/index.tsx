'use client';
import React from 'react';
import styles from './inputUploadFile.module.css';
import FormInput from '../FormInput';
import UploadButton from '../uploadButton';
import { Col, Row } from 'antd';
export default function InputUploadFile() {
	return (
		<>
			<div className={styles['inputUploadFile']}>
				<Row align="middle">
					<Col lg={18} md={18} sm={16} xs={16}>
						<FormInput placeHolder="Upload Image" />
					</Col>
					<Col lg={6} md={6} sm={8} xs={8} className="textEnd">
						<UploadButton />
					</Col>
				</Row>
			</div>
		</>
	);
}
