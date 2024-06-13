'use client';
import { Col, Row } from 'antd';
import styles from './style.module.css';
import React from 'react';
import type { CSSProperties } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';
import { FaMinus } from 'react-icons/fa6';
import ParaText from '../ParaText';

const text = `
Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore  ismod nulla. Elit adipiscing proin quis est consectetur. Felis ultricies nisi, quis malesuada sem odio. Potentiмnibh natoque amet amet, tincidunt ultricies et. Et nam rhoncus sit nullam diam tincidunt condimentum nullam.
`;

const text2 = `
Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore  ismod nulla. Elit adipiscing proin quis est consectetur. Felis ultricies nisi, quis malesuada sem odio. Potentiмnibh natoque amet amet, tincidunt ultricies et. Et nam rhoncus sit nullam diam tincidunt condimentum nullam.
`;

const text3 = `
Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore  ismod nulla. Elit adipiscing proin quis est consectetur. Felis ultricies nisi, quis malesuada sem odio. Potentiмnibh natoque amet amet, tincidunt ultricies et. Et nam rhoncus sit nullam diam tincidunt condimentum nullam.
`;

const text4 = `
Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore  ismod nulla. Elit adipiscing proin quis est consectetur. Felis ultricies nisi, quis malesuada sem odio. Potentiмnibh natoque amet amet, tincidunt ultricies et. Et nam rhoncus sit nullam diam tincidunt condimentum nullam.
`;

const text5 = `
Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore  ismod nulla. Elit adipiscing proin quis est consectetur. Felis ultricies nisi, quis malesuada sem odio. Potentiмnibh natoque amet amet, tincidunt ultricies et. Et nam rhoncus sit nullam diam tincidunt condimentum nullam.
`;

const text6 = `
Nibh quisque suscipit fermentum netus nulla cras porttitor euismod nulla. Orci, dictumst nec aliquet id ullamcorper venenatis. Fermentum sulla craspor ttitore  ismod nulla. Elit adipiscing proin quis est consectetur. Felis ultricies nisi, quis malesuada sem odio. Potentiмnibh natoque amet amet, tincidunt ultricies et. Et nam rhoncus sit nullam diam tincidunt condimentum nullam.
`;

const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => [
	{
		key: '1',
		label: 'Do you offer discounts if I pay by the week or month?',
		children: <p>{text}</p>,
		style: panelStyle
	},
	{
		key: '2',
		label: 'What are your office hours?',
		children: <p>{text2}</p>,
		style: panelStyle
	},
	{
		key: '3',
		label: 'Do you offer housekeeping service?',
		children: <p>{text3}</p>,
		style: panelStyle
	},
	{
		key: '4',
		label: 'Are there any extra fees, like security deposits?',
		children: <p>{text2}</p>,
		style: panelStyle
	},
	{
		key: '5',
		label: 'Do you welcome pets in the hotel?',
		children: <p>{text2}</p>,
		style: panelStyle
	}
];

export default function CollapsePanel() {
	const { token } = theme.useToken();

	const panelStyle: React.CSSProperties = {
		marginBottom: 4,
		border: 'none'
	};

	return (
		<>
			<div className={styles['collapsePanel']}>
				<Row>
					<Col xl={24} md={24} sm={24} xs={24}>
						<div className={styles['collapsePanelBox']}>
							<ParaText size="small" color="black" className="weight600">
								What are your office hours?
							</ParaText>
							<br />
							<br />
							<ParaText size="extraSmall" color="black">
								Front office hours are 4:00 PM to 6:00 PM and by appointment every day of the week and
								year-round. Guests may check-in between 4:00 PM and 2:30 AM. Hours may be expanded for
								special events. Please check with the specific property for details.
							</ParaText>
						</div>
					</Col>
				</Row>
			</div>
		</>
	);
}
