import React from 'react';
import styles from './deactivateAccounts.module.css';
import { Col, Row } from 'antd';
import Titles from '../Titles';
import ParaText from '../ParaText';
import { CloseCircleFilled } from '@ant-design/icons';
import SecondaryButton from '../SecondaryButton';

interface DeleteConfirmationField {
	title: string;
	para: string;
	onDelete: () => void;
	onClose: (type: string) => void; // Add a callback function for close action
}
export default function DeleteConfirmation({ title, para, onDelete, onClose }: DeleteConfirmationField) {
	const handleDelete = () => {
		onDelete();
	};

	const handleClose = () => {
		onClose('close'); // Call the onClose callback when the "Cancel" button is clicked
	};

	return (
		<>
			<div className={styles.modalPanel}>
				<br />
				<center>
					<Titles level={5}>{title}</Titles>
				</center>
				<center>
					<ParaText size="small">{para}.</ParaText>
				</center>
			</div>
			<br />
			<Row align="middle" gutter={16}>
				<Col lg={12} md={12} sm={12} xs={12}>
					<SecondaryButton
						label="Cancel "
						className="paddingRemove"
						type="gray"
						width="100%"
						onClick={handleClose}
					></SecondaryButton>
				</Col>
				<Col lg={12} md={12} sm={12} xs={12}>
					<SecondaryButton
						label="Delete"
						className="paddingRemove"
						type="danger"
						width="100%"
						onClick={handleDelete}
					></SecondaryButton>
				</Col>
			</Row>
		</>
	);
}
