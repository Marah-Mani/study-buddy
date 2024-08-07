'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import MatchedResult from './MatchedResult';
import UnMatchedResult from './UnMatchedResult';
import AuthContext from '@/contexts/AuthContext';
import { getAllCandidate } from '@/lib/commonApi';

export default function Page() {
    const [totalStudent, setTotalStudent] = useState(0);
    const [totalTutors, setTotalTutors] = useState(0);
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (user) fetchAllCandidates();
    }, [user]);
    const fetchAllCandidates = async () => {
        const query = {
            userId: user?._id
        };

        try {
            const response = await getAllCandidate(query);
            if (response.status === true) {
                setTotalStudent(response.studentCount);
                setTotalTutors(response.tutorCount);
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const items = [
        { label: `${totalStudent} Students`, component: <MatchedResult type='student' /> },
        { label: `${totalTutors} Tutors`, component: <UnMatchedResult type='tutor' /> },
    ].map((item, index) => ({
        label: item.label,
        key: String(index + 1),
        children: item.component
    }));

    return (
        <>
            <div className='boxInbox'>
                <Tabs tabPosition='top' defaultActiveKey="2" items={items} />
            </div>
        </>
    );
}
