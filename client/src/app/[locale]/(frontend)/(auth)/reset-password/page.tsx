import ResetPassword from '@/components/frontend/ResetPassword';
import React from 'react';
import './style.css'
import { Col, Row } from 'antd';
export default function Page() {
	return (
		<>

			<div className='background-color'>
				<Row gutter={[0, 0]}>
					<Col xs={0} sm={0} md={0} lg={12} xl={12} xxl={12} className='textCenter'>
						<div> <img src='/images/logo.png' alt='' /> </div></Col>
					<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
						<div className="login-container">
							<div className="login-content">
								<div className="login-content_header">
									<ResetPassword />
								</div>
							</div>
						</div>
					</Col>

				</Row>
			</div>
		</>
	);
}
