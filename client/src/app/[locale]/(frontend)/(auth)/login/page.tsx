import Login from '@/components/frontend/Login';
import React from 'react';
import './style.css'
export default function Page() {
	return (
		<>
			<div className='back'>
				<div>
					<div className="login-container">
						<div className="login-content">
							<div className="login-content_header">
								<Login />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
