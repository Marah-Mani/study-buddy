'use client';
import React from 'react';
import { Select } from 'antd';
import styles from './selectBoxFild.module.css';

const onChange = (value: string) => {
	console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
	console.log('search:', value);
};

const filterOption = (input: string, option?: { label: string; value: string }) =>
	(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

export default function SelectBoxFiled() {
	return (
		<>
			<div id="classBorderColor">
				<Select
					showSearch
					bordered={false}
					placeholder="Select a person"
					optionFilterProp="children"
					onChange={onChange}
					onSearch={onSearch}
					filterOption={filterOption}
					className={`${styles.selectFiled}`}
					options={[
						{
							value: 'jack',
							label: 'Jack'
						},
						{
							value: 'lucy',
							label: 'Lucy'
						},
						{
							value: 'tom',
							label: 'Tom'
						}
					]}
				/>
			</div>
		</>
	);
}
