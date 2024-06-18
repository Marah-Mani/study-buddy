import Register from '@/components/frontend/Register';
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
								<Register />
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
