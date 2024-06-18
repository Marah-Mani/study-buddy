'use client'
import React, { useState } from 'react';
import './style.css'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Input, Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: <Input placeholder="Enter Your Keyword Here" style={{ border: 'none' }} />,
        key: 'mail',
    },
    {
        label: 'All Categories',
        key: 'SubMenu',
        children: [
            {
                type: 'group',
                label: 'Item 1',
                children: [
                    { label: 'Option 1', key: 'setting:1' },
                    { label: 'Option 2', key: 'setting:2' },
                ],
            },
            {
                type: 'group',
                label: 'Item 2',
                children: [
                    { label: 'Option 3', key: 'setting:3' },
                    { label: 'Option 4', key: 'setting:4' },
                ],
            },
        ],
    }, {
        label: 'Student',
        key: 'Student',
        children: [
            {
                type: 'group',
                label: 'Item 1',
                children: [
                    { label: 'Option 1', key: 'setting:4' },
                    { label: 'Option 2', key: 'setting:6' },
                ],
            },
            {
                type: 'group',
                label: 'Item 2',
                children: [
                    { label: 'Option 3', key: 'setting:7' },
                    { label: 'Option 4', key: 'setting:8' },
                ],
            },
        ],
    },
];

export default function Page() {
    const [current, setCurrent] = useState('mail');
    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    return (
        <div>
            <div className='gapMarginTop'>
                <div className='menuStyle'>  <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} style={{ border: 'none' }} /></div>
            </div>
        </div>
    )
}

