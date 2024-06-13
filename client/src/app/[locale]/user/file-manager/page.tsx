'use client'
import React, { useContext, useState } from 'react';
import './style.css';
import { Tabs } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import Dashboard from './MainComponents/Dashboard';
import AuthContext from '@/contexts/AuthContext';
import FavoriteFiles from './MainComponents/FavoriteFiles';
import RecentFiles from './MainComponents/RecentFiles';
import MyFiles from './MainComponents/MyFiles';
import { FcEmptyTrash } from 'react-icons/fc';
import { SlEnvolopeLetter } from 'react-icons/sl';
import { HomeOutlined, ShareAltOutlined, ProfileOutlined } from '@ant-design/icons';
import RecycleBin from './RecycleBin';

export default function Page() {
    const [initialState, setInitialState] = useState('');
    const [key, setKey] = useState('1');

    const items = [
        {
            label: (
                <p onClick={() => {
                    if (initialState === 'dashboard') {
                        setInitialState('');
                    } else {
                        setInitialState('dashboard');
                    }
                }}><HomeOutlined /> Dashboard</p>
            ), component: <Dashboard activeKey={key} initialState={initialState} />
        },
        {
            label: (
                <p><HomeOutlined /> My Files</p>
            ), component: <MyFiles activeKey={key} />
        },
        {
            label: (
                <p><ProfileOutlined /> Favorites</p>
            ), component: <FavoriteFiles activeKey={key} />
        },
        {
            label: (
                <p><SlEnvolopeLetter /> Recent Files</p>
            ), component: <RecentFiles activeKey={key} />
        },
        {
            label: (
                <p><FcEmptyTrash /> Recycle Bin</p>
            ), component: <RecycleBin activeKey={key} />
        },
    ].map((item, index) => ({
        label: item.label,
        key: String(index + 1),
        children: item.component
    }));

    return (
        <>
            <div id='fileManagerPage'>
                <div className="smallTopMargin"></div>
                <div className='boxInbox'>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        File Manager
                    </ParaText>
                    <div className="largeTopMargin"></div>
                    <Tabs tabPosition='left' defaultActiveKey="1" items={items} onChange={(value) => setKey(value)} />
                </div>
            </div>
        </>
    );
}
