import React from 'react';
import moment from 'moment-timezone';

interface TimeZoneDifferenceProps {
    timeZone1: any; // Your current user's time zone
    timeZone2: any; // Time zone of the other user in the chat
}

const TimeZoneDifference = ({ timeZone1, timeZone2 }: TimeZoneDifferenceProps) => {
    const getTimeDifference = () => {
        const now = moment();
        const offset1 = moment.tz(now, timeZone1).utcOffset();
        const offset2 = moment.tz(now, timeZone2).utcOffset();

        const totalDifferenceInMinutes = offset2 - offset1;
        const differenceInHours = Math.floor(totalDifferenceInMinutes / 60);
        const differenceInMinutes = totalDifferenceInMinutes % 60;

        return { differenceInHours, differenceInMinutes, offsetDifference: totalDifferenceInMinutes };
    };

    const { differenceInHours, differenceInMinutes, offsetDifference } = getTimeDifference();

    const getTimeDifferenceMessage = () => {
        if (offsetDifference === 0) {
            return "Same time zone.";
        } else if (offsetDifference > 0) {
            return `${differenceInHours} hours and ${differenceInMinutes} minutes ahead.`;
        } else {
            return `${-differenceInHours} hours and ${-differenceInMinutes} minutes behind.`;
        }
    };

    return (
        <span>
            {getTimeDifferenceMessage()}
        </span>
    );
};

export default TimeZoneDifference;
