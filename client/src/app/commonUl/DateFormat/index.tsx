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

        const month = targetDate.toLocaleString('default', { month: 'long' });
        const year = targetDate.getFullYear();
        const hours = targetDate.getHours();
        const minutes = targetDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

        const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

        return `${day}, ${month} ${year}, ${formattedTime}`;
    };

    return <span>{formatDate(date)}</span>;
};

export default DateFormat;
