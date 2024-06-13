"use client"

import AuthContext from "@/contexts/AuthContext";
import { lastSeenUserDate } from "@/lib/userApi";
import { useContext, useEffect, useState } from "react";

export default function LastLoginDateTime() {
    const { user } = useContext(AuthContext);
    const [formattedDate, setFormattedDate] = useState('');

    const lastSeen = async () => {
        if (user?._id && user?.role == 'user') {
            const res = await lastSeenUserDate(user?._id);
            if (res.status === true) {
                setFormattedDate(res.lastSeenData);
            }
        }
    }

    useEffect(() => {
        lastSeen();
        const interval = setInterval(() => {
            lastSeen();
        }, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user?._id]);
    return (
        <>
        </>

    );
};
