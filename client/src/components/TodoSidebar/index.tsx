import React, { useContext, useEffect, useState } from 'react'
import { Col, Row, Menu, Button, Input, Modal, Form, Select, DatePicker, message } from 'antd';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import Search from 'antd/es/input/Search';
const { Option } = Select;
export default function TodoSidebar({ fetchTasks }: any) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (value: any) => {
        setSearchValue(value);
        fetchTasks({ searchQuery: value });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        fetchTasks({ searchQuery: value });
    };

    const itemGroupStyle = {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#000',
    };
    return (
        <>
            <Search
                placeholder="Search Task Here"
                allowClear
                style={{ marginBottom: '16px', marginTop: '16px' }}
                onSearch={handleSearch}
                onChange={handleChange}
                maxLength={20}
            />
            <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.ItemGroup key="taskGroup" title={<span style={itemGroupStyle}>Tasks</span>}>
                    <Menu.Item key="1">
                        <Link href="#" onClick={() => fetchTasks({ status: '' })}>All Task</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link href="#" onClick={() => fetchTasks({ status: 'pending' })}>Pending</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link href="#" onClick={() => fetchTasks({ status: 'in_progress' })}>Progress</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link href="#" onClick={() => fetchTasks({ status: 'completed' })}>Completed</Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                        <Link href="#" onClick={() => fetchTasks({ status: 'expired' })}>Expired</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup key="categoryGroup" title={<span style={itemGroupStyle}>Categories</span>}>
                    <Menu.Item key="5">
                        <Link href="#" onClick={() => fetchTasks({ status: '', category: 'personal' })}>Personal</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Link href="#" onClick={() => fetchTasks({ status: '', category: 'work' })}>Work</Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <Link href="#" onClick={() => fetchTasks({ status: '', category: 'health_and_fitness' })}>Health & Fitness</Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link href="#" onClick={() => fetchTasks({ status: '', category: 'daily_goals' })}>Daily Goals</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
            </Menu>

        </>
    )
}
