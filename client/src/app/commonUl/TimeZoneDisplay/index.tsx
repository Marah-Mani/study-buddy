import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';

interface Props {
    userTimeZone: any;
}

const TimeZoneDisplay = ({ userTimeZone }: Props) => {
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        if (!userTimeZone) {
            return;  // if userTimeZone is empty, do not proceed
        }

        const updateCurrentTime = () => {
            const now = moment().tz(userTimeZone);
            setCurrentTime(now.format('MMM-DD-YYYY HH:mm a'));
        };

        updateCurrentTime();
        const intervalId = setInterval(updateCurrentTime, 1000);

        return () => clearInterval(intervalId);
    }, [userTimeZone]);

    if (!userTimeZone) {
        return null;  // return nothing if userTimeZone is empty
    }

    return (
        <p style={{ textAlign: 'center' }}>{currentTime}</p>
    );
};

export default TimeZoneDisplay;
