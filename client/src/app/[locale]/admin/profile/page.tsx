'use client';
import React from 'react';
import './style.css';
import ParaText from '@/app/commonUl/ParaText';
import EditProfile from '@/components/Admin/UserProfile/EditProfile';
export default function settings() {
    return (
        <>
            <div className="smallTopMargin"></div>
            <div className='boxInbox'>
                <div className="largeTopMargin"></div>
                <ParaText size="large" fontWeightBold={600} color="primaryColor">
                    Profile
                </ParaText>
                <div className="largeTopMargin"></div>
                <EditProfile />
            </div>
        </>
    );
}

