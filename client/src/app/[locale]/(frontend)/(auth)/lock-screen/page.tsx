import LockScreen from '@/components/frontend/LockScreen';
import React from 'react';
import { Col, Row } from 'antd';
import './style.css'
export default function Page() {

	return (
		<>
			<div className='background-color'>
				<div className="waves">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
						<path fill="#f1a638" fill-opacity="1" d="M0,96L30,112C60,128,120,160,180,160C240,160,300,128,360,122.7C420,117,480,139,540,149.3C600,160,660,160,720,149.3C780,139,840,117,900,112C960,107,1020,117,1080,144C1140,171,1200,213,1260,202.7C1320,192,1380,128,1410,96L1440,64L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
					</svg>
				</div>
				<Row gutter={[0, 0]} align='middle' className='lock-screen' >
					<Col xs={0} sm={0} md={0} lg={12} xl={12} xxl={12} className='textCenter'>
						<div> <img src='/images/logo.png' alt='' /> </div></Col>
					<Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
						<div className="login-container">
							<div className="login-content">
								<div className="login-content_header">
									<LockScreen />
								</div>
							</div>
						</div>
					</Col>

				</Row>
			</div>

		</>
	);
}
