import React from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { DatePickerProps } from 'antd';
import { DatePicker } from 'antd';

dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];

const customFormat: DatePickerProps['format'] = (value) => `custom format: ${value.format(dateFormat)}`;

const customWeekStartEndFormat: DatePickerProps['format'] = (value) =>
	`${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value).endOf('week').format(weekFormat)}`;

const DatePickerDesign: React.FC = () => {
	return (
		<>
			{/* Display some text (e.g., "DatePicker") */}
			<p>DatePicker</p>
			{/* Uncomment the following line to use Ant Design DatePicker */}
			{/* <DatePicker defaultValue={dayjs('MM/DD/YYYY', dateFormat)} format={dateFormat} style={{ border: 'none' }} /> */}
		</>
	);
};

export default DatePickerDesign;
