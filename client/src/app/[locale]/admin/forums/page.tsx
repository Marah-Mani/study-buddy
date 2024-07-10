'use client'
import Forums from '@/components/Admin/Forums';
import React from 'react'
import './style.css'

export default function page() {
    return (
        <>
            <div className="largeTopMargin"></div>
            <div className='baseBody'>
                <Forums activeKey={''} newRecord={undefined} onBack={undefined} setNewRecord={function (value: React.SetStateAction<boolean>): void {
                    throw new Error('Function not implemented.');
                }}
                />
            </div>
        </>
    )
}
