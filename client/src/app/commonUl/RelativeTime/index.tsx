import React from 'react';

interface Props {
    date: any,
}

const calculateRelativeTime = (date: any) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    let value, unit;
    if (diffInSeconds < 60) {
        value = diffInSeconds;
        unit = 'seconds';
    } else {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            value = diffInMinutes;
            unit = 'minutes';
        } else {
            const diffInHours = Math.floor(diffInMinutes / 60);
            if (diffInHours < 24) {
                value = diffInHours;
                unit = 'hours';
            } else {
                const diffInDays = Math.floor(diffInHours / 24);
                if (diffInDays < 30) {
                    value = diffInDays;
                    unit = 'days';
                } else {
                    const diffInMonths = Math.floor(diffInDays / 30);
                    if (diffInMonths < 12) {
                        value = diffInMonths;
                        unit = 'months';
                    } else {
                        const diffInYears = Math.floor(diffInMonths / 12);
                        value = diffInYears;
                        unit = 'years';
                    }
                }
            }
        }
    }
    return { value, unit };
};

const RelativeTime = ({ date }: Props) => {
    const { value, unit } = calculateRelativeTime(date);
    return (
        <span>
            <span style={{ fontWeight: '400' }}>{value}</span> <span style={{ fontWeight: 'normal' }}>{unit} ago</span>
        </span>
    );
};

export default RelativeTime;
