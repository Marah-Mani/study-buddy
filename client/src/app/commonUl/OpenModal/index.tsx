'use client';
import React from 'react';
import { Modal } from 'antd';
interface ModalProps {
	children?: React.ReactNode;
	title?: any;
	width?: number;
	open?: boolean;
	onClose?: () => void;
}
export default function OpenModal({ children, title, width, open = false, onClose }: any) {
	return (
		<>
			<div className="mainContainer">
				<div className="modalTitle">
					<Modal
						className="modalStyle"
						title={title}
						open={open}
						width={width}
						footer={null}
						onCancel={onClose}
						centered
					>
						{children}
					</Modal>
				</div>
			</div>
		</>
	);
}
