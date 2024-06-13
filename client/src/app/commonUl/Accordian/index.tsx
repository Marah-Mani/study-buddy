import React from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

const text = (
	<p style={{ paddingLeft: 24 }}>
		A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome
		guest in many households across the world.
	</p>
);

const items: CollapseProps['items'] = [
	{
		key: '1',
		label: (
			<div>
				<span>
					{' '}
					<a href="#">DAY 1</a> - Arrival and Orientation
				</span>
			</div>
		),
		children: text
	},
	{
		key: '2',
		label: (
			<div>
				<span>
					{' '}
					<a href="#">DAY 2</a> - City Tour
				</span>
			</div>
		),
		children: text
	},
	{
		key: '3',
		label: (
			<div>
				<span>
					<a href="#">DAY 3</a> - Cooking Clas
				</span>
			</div>
		),
		children: text
	},
	{
		key: '4',
		label: (
			<div>
				<span>
					<a href="#">DAY 4</a> - Nature Hike
				</span>
			</div>
		),
		children: text
	},
	{
		key: '5',
		label: (
			<div>
				<span>
					<a href="#">DAY 5</a> - Free Day
				</span>
			</div>
		),
		children: text
	}
];

const App: React.FC = () => <Collapse items={items} bordered={false} defaultActiveKey={['1']} />;

export default App;
