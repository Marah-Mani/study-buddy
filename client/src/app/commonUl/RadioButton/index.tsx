import React, { useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';

interface RadioButtonProps {
	initialValue?: number;
}

export default function RadioButton({ initialValue = 1 }: RadioButtonProps) {
	const [value, setValue] = useState(initialValue);

	const onChange = (e: RadioChangeEvent) => {
		console.log('radio checked', e.target.value);
		setValue(e.target.value);
	};

	return (
		<>
			<div className="radioWrapper customContainer">
				<Radio.Group onChange={onChange} value={value}>
					<Radio value={1}></Radio>
					<Radio value={2}></Radio>
				</Radio.Group>
			</div>
		</>
	);
}
