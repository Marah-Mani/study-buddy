'use client'
import ParaText from '@/app/commonUl/ParaText'
import { getDepartments } from '@/lib/ApiAdapter';
import { Button, Col, Dropdown, Input, Row, Space, Menu } from 'antd';
import React, { useEffect, useState } from 'react'
import { IoMdArrowDropdown } from 'react-icons/io'
import './style.css'
import TableData from './TableData'

export default function Page() {
    const [searchInput, setSearchInput] = useState<string>('');
    const [categoryId, setCategoryId] = useState<any>();
    const [subCatId, setSubCatId] = useState<any>('');
    const [departments, setDepartments] = useState<any>([]);

    useEffect(() => {
        getDepartments().then((res) => {
            if (res.status === true) {
                setDepartments(res.data);
            }
        });
    }, [])
    const handleDepartmentChange = (e: any) => {
        if (e.key == 'all') {
            setCategoryId(null);
            setSubCatId('');
            return;
        }
        const selected: any = departments.find((item: any) => item._id === e.key);
        setCategoryId(selected);
    };

    const handleCourseChange = (e: any) => {
        setSubCatId(e.key);
    };

    const capitalizeFirstLetterOfEachWord = (text: string) => {
        if (!text) return text;
        return text.replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getSubjectsForDepartment = (departmentName: string): string[] => {
        const selectedDept = departments.find((dept: any) => dept._id === departmentName); // Assuming _id is used as the unique identifier
        return selectedDept ? selectedDept.subjects : [];
    };

    return (
        <>
            <div className="dashBody">
                <div className='gapMarginTopTwo'></div>
                <Row align='middle' gutter={[16, 16]}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
                        <ParaText size="large" fontWeightBold={600} color="primaryColor">
                            Users
                        </ParaText>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                        <Space>
                            <Dropdown
                                overlay={
                                    <div style={{ border: '2px solid #f1a638', borderRadius: '8px' }}>
                                        <Menu
                                            onClick={handleDepartmentChange}
                                        >
                                            <Menu.Item key="all" className="hovercolor">
                                                All
                                            </Menu.Item>
                                            {departments &&
                                                departments.map((item: any) => (
                                                    <Menu.Item key={item._id} className="hovercolor">
                                                        {capitalizeFirstLetterOfEachWord(
                                                            item?.departmentName
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                        </Menu>
                                    </div>
                                }
                            >
                                <Button
                                    style={{
                                        width: '250px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {categoryId?.departmentName
                                            ? capitalizeFirstLetterOfEachWord(
                                                categoryId.departmentName
                                            )
                                            : 'Select Department'}
                                    </span>
                                    <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                                </Button>
                            </Dropdown>
                            <Dropdown
                                overlay={
                                    <div style={{ border: '2px solid #f1a638', borderRadius: '8px' }}>
                                        <Menu onClick={handleCourseChange}>
                                            {categoryId?._id ? (
                                                getSubjectsForDepartment(categoryId._id).map(
                                                    (subject: string, index: number) => (
                                                        <Menu.Item key={subject} className="hovercolor">
                                                            {capitalizeFirstLetterOfEachWord(subject)}
                                                        </Menu.Item>
                                                    )
                                                )
                                            ) : (
                                                <Menu.Item key={''} className="hovercolor" disabled>
                                                    Select Course
                                                </Menu.Item>
                                            )}
                                        </Menu>

                                    </div>
                                }
                            >
                                <Button
                                    style={{
                                        width: '250px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {subCatId
                                            ? capitalizeFirstLetterOfEachWord(
                                                subCatId
                                            )
                                            : 'Select Course'}
                                    </span>
                                    <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                                </Button>
                            </Dropdown>
                            <Input allowClear placeholder="Search" style={{ height: '38px', width: '100%', borderRadius: '30px' }} className='buttonClass' onChange={(e) => setSearchInput(e.target.value)} />
                        </Space>

                    </Col>
                </Row>
                <div className='gapMarginTopTwo'></div>
                <TableData categoryId={categoryId} subCatId={subCatId} reload={false} onEdit={undefined} searchInput={searchInput} />
            </div>
        </>
    )
}
