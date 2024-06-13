"use client"
import { useEffect, useState } from "react"
interface props {
    userLastSeen: any;
}

export default function FormateLastSeen({ userLastSeen }: props) {
    const [lastSeen, SetLastSeen] = useState([])

    useEffect(() => {
        const lastSeenDate = new Date(userLastSeen);
        const now = new Date();

        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const diffDays = Math.floor((now.getTime() - lastSeenDate.getTime()) / oneDay);

        let date: any;
        if (diffDays === 0) {
            date = `Today Last Seen ${lastSeenDate.toLocaleTimeString()}`;
        } else if (diffDays === 1) {
            date = `Yesterday Last Seen ${lastSeenDate.toLocaleTimeString()}`;
        } else {
            date = `${lastSeenDate.toLocaleDateString()} at ${lastSeenDate.toLocaleTimeString()}`;
        }
        SetLastSeen(date)
    }, [])
    // console.log(lastSeen)

    return (
        <>
            <div>
                <p>{lastSeen}</p>
            </div>
        </>
    )
}
