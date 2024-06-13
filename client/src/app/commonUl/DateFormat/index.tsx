import React from 'react';

interface Props {
    date: Date;
}

const DateFormat = ({ date }: Props) => {
    const formatDate = (date: Date) => {
        const targetDate = new Date(date);

        if (isNaN(targetDate.getTime())) {
            return 'Invalid date';
        }

        const day = targetDate.getDate();
        const month = targetDate.toLocaleString('default', { month: 'short' });
        const year = targetDate.getFullYear();

        return `${day}, ${month} ${year}`;
    };

    return <span>{formatDate(date)}</span>;
};

export default DateFormat;
