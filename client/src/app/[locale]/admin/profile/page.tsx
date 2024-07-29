'use client';
import React from 'react';
import './style.css';
import EditProfile from '@/components/Admin/UserProfile/EditProfile';
export default function settings() {
    return (
        <>
            <div className=''>
                <EditProfile />
            </div>
        </>
    );
}

