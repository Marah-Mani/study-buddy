'use client';
import React, { useContext, useState } from 'react';
import styles from './dropDown.module.css';
import { Dropdown, Space, Menu, message } from 'antd';
import ParaText from '../ParaText';
import { IoChevronDown } from 'react-icons/io5';

interface DropDownProps {
	options: {
		label: string;
		onClick: () => void;
	}[];
	editId: string | undefined;
	deleteId: string | undefined;
}

const DropDown: React.FC<DropDownProps> = ({ options, deleteId, editId }) => {
	const menu = (
		<Menu>
			{options.map((option, index) => (
				<Menu.Item key={index} onClick={option.onClick}>
					{option.label}
				</Menu.Item>
			))}
		</Menu>
	);

	return (
		<>
			<div className={styles.dropDown}>
				<Dropdown overlay={menu} trigger={['click']}>
					<a onClick={(e) => e.preventDefault()} className="align">
						<Space>
							<ParaText size="extraSmall" color="secondaryColor" className="weight700">
								Actions
								<IoChevronDown color="#0070F5" />
							</ParaText>
						</Space>
					</a>
				</Dropdown>
			</div>
		</>
	);
};

export default DropDown;
