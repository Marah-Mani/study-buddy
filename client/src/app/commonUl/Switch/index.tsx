import React from 'react';
import { Switch as AntSwitch } from 'antd';
export default function Switch() {
	return (
		<>
			<div className="switchWrapper ">
				<AntSwitch defaultChecked />
			</div>
		</>
	);
}
