import styles from './checkBox.module.css';
import React, { useState, useEffect } from 'react';
import { Checkbox } from 'antd';

interface CheckBoxProps {
	title?: any;
	name?: any; // Keep it optional
	checked?: boolean;
	onChange?: any;
	value?: any;
}

const CheckBox: React.FC<CheckBoxProps> = ({ title, name, checked, value, onChange }) => {
	return (
		<div className="customContainer">
			<div className={`${styles['checkboxWrapper']} ${styles['modalCheckbox']}`}>
				<Checkbox name={name} onChange={onChange}>
					{title}
				</Checkbox>
			</div>
		</div>
	);
};

export default CheckBox;
