'use client'
import React, { useContext, useState } from 'react';
import './style.css';
import { Tabs } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import { FcEmptyTrash } from 'react-icons/fc';
import { SlEnvolopeLetter } from 'react-icons/sl';
import { HomeOutlined, ProfileOutlined } from '@ant-design/icons';
import Dashboard from '@/components/FileManager/MainComponents/Dashboard';
import MyFiles from '@/components/FileManager/MainComponents/MyFiles';
import FavoriteFiles from '@/components/FileManager/MainComponents/FavoriteFiles';
import RecycleBin from '@/components/FileManager/MainComponents/RecycleBin';
import RecentFiles from '@/components/FileManager/MainComponents/RecentFiles';
import AuthContext from '@/contexts/AuthContext';
import Loading from '@/app/commonUl/Loading';

export default function Page() {
    const [initialState, setInitialState] = useState('');
    const [key, setKey] = useState('1');
    const { user } = useContext(AuthContext);

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
                <p><HomeOutlined /> Files</p>
            ), component: <MyFiles activeKey={key} type={''} />
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

    if (!user) {
        return (
            <Loading />
        );
    }

    return (
        <>
            <div id='fileManagerPage'>
                <div className=''>
                    <Tabs tabPosition='top' defaultActiveKey="1" items={items} onChange={(value) => setKey(value)} />
                </div>
            </div>
        </>
    );
}
