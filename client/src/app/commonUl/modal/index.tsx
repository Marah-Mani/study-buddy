'use client';
import React from 'react';
import styles from './modalPopup.module.css';
import { Image, Input } from 'antd';
export default function ModalPopup() {
	return (
		<>
			<div className={styles['notificationsBlank']}>
				<div className="textLeft">
					<div className="textCenter">
						<Image src="/images/admin/Ellipse.png" alt="" />
					</div>
					<div className={styles['popupStyleBox']}>
						<div className="mediumTopMargin"></div>
						<label htmlFor="">Guest name</label>
						<Input placeholder="Mr. Alexander Martin" />
						<div className="mediumTopMargin"></div>
						<label htmlFor="">Registration number</label>
						<Input placeholder="24665" />
						<div className="mediumTopMargin"></div>
						<label htmlFor="">Check in date</label>
						<Input placeholder="18/12/23" />
						<div className="mediumTopMargin"></div>
						<label htmlFor="">Room type</label>
						<Input placeholder="Single" />
						<div className="mediumTopMargin"></div>
						<label htmlFor="">Stay</label>
						<Input placeholder="4 nights" />
						<div className="mediumTopMargin"></div>
						<label htmlFor="">Discount</label>
						<Input placeholder="$ 100" />
					</div>
				</div>
			</div>
		</>
	);
}
