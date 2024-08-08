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


    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        // Initial check
        handleResize();

        // Event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <div className="dashBody">
                <Row align='middle' gutter={[16, 16]}>
                    <Col xs={0} sm={0} md={4} lg={9} xl={11} xxl={14}></Col>
                    <Col xs={24} sm={24} md={6} lg={5} xl={4} xxl={3} className='textEnd'>
                        <Input allowClear placeholder="Search" style={{ width: '100%', borderRadius: '30px' }} className='buttonClass' onChange={(e) => setSearchInput(e.target.value)} />
                    </Col>
                    <Col xs={0} sm={0} md={0} lg={0} xl={9} xxl={7} className={`${isMobile ? 'textCenter' : ''}`}>
                        <Space wrap>
                            <Dropdown
                                overlay={
                                    <div style={{ border: '2px solid #f1a638', borderRadius: '8px', marginBottom: '10px' }}>
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
                                        width: '196px',
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
                                        width: '196px',
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
                        </Space>

                    </Col>
                    <Col xs={12} sm={12} md={7} lg={5} xl={0} xxl={0} >
                        <Dropdown
                            overlay={
                                <div style={{ border: '2px solid #f1a638', borderRadius: '8px', marginBottom: '10px' }}>
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
                                    width: `${isMobile ? '190px' : '196px'}`,
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
                    </Col>
                    <Col xs={12} sm={12} md={7} lg={5} xl={0} xxl={0}>
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
                                    width: `${isMobile ? '190px' : '196px'}`,
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
                    </Col>
                </Row>
                <div className='gapMarginTopTwo'></div>
                <TableData categoryId={categoryId} subCatId={subCatId} reload={false} onEdit={undefined} searchInput={searchInput} />
            </div>
        </>
    )
}
