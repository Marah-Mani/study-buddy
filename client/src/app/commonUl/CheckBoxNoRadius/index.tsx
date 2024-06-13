import styles from './checkBox.module.css';
import React from 'react';
import { Checkbox } from 'antd';

interface CheckBoxNoRadiusProps {
	title?: string;
}

const CheckBoxNoRadius: React.FC<CheckBoxNoRadiusProps> = ({ title }) => {
	return (
		<>
			<div className="customContainer" id="borderClassNone">
				<div className={`${styles.checkboxWrapper} ${styles.modalCheckbox}`}>
					<Checkbox value="A" className={`${styles.borderRadius}`}>
						{title}
					</Checkbox>
				</div>
			</div>
		</>
	);
};

export default CheckBoxNoRadius;
