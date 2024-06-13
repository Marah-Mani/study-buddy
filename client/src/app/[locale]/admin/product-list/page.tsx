'use client';
import React, { useState } from 'react';
import './style.css'
import ParaText from '@/app/commonUl/ParaText';
import TableData from './TableData';
export default function Dashboard() {
	return (
		<>
			<div className='dashBody gapMarginTop'>
				<div className="">
					<ParaText size="large" fontWeightBold={600} color="PrimaryColor">
						Product List
					</ParaText>
				</div>
				<div className='gapMarginTopOne'></div>
				<TableData />
			</div>
		</>
	);
}
