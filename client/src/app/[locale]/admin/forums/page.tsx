'use client'
import Forums from '@/components/Admin/Forums';
import React from 'react'
import styles from './forum.module.css';

export default function page() {
    return (
        <>
            <div className={styles.baseBody}>
                <div className="gapMarginTopOne"></div>
                <Forums activeKey={''} />
            </div>
        </>
    )
}
