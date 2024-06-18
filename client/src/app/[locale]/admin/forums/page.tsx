'use client'
import Forums from '@/components/Admin/Forums';
import React from 'react'
import './style.css'

export default function page() {
    return (
        <>
            <div className='baseBody'>
                <Forums activeKey={''} />
            </div>
        </>
    )
}
