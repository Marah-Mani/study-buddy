import React from 'react'
import { Col, Row, Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { IoMdEye } from "react-icons/io";
import { FcFolder } from "react-icons/fc";
import { RiDeleteBin5Fill } from "react-icons/ri";
interface DataType {
    key: string;
    name: any;
    age: any;
    address: any;
    tags: any;
}

export default function TableData() {
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'File Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Category',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Size',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Date Modified',
            key: 'tags',
            dataIndex: 'tags',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <span className='eyes'> <IoMdEye /></span>
                    <span className='delete'>  <RiDeleteBin5Fill /></span>
                </Space>
            ),
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            name: <Row align='middle' gutter={[6, 6]}><Col><FcFolder /></Col><Col>
                VID-00292312-SPK823.mp4</Col></Row>,
            age: 'Videos',
            address: '87MB',
            tags: '22,Nov 2022',
        },
        {
            key: '2',
            name: <Row align='middle' gutter={[6, 6]}><Col><FcFolder /></Col><Col>
                VID-00292312-SPK823.mp4</Col></Row>,
            age: 'Videos',
            address: '87MB',
            tags: '22,Nov 2022',
        },
        {
            key: '3',
            name: <Row align='middle' gutter={[6, 6]}><Col><FcFolder /></Col><Col>
                VID-00292312-SPK823.mp4</Col></Row>,
            age: 'Videos',
            address: '87MB',
            tags: '22,Nov 2022',
        },
        {
            key: '4',
            name: <Row align='middle' gutter={[6, 6]}><Col><FcFolder /></Col><Col>
                VID-00292312-SPK823.mp4</Col></Row>,
            age: 'Videos',
            address: '87MB',
            tags: '22,Nov 2022',
        },
        // {
        //     key: '5',
        //     name: <Row align='middle' gutter={[6, 6]}><Col><FcFolder /></Col><Col>
        //         VID-00292312-SPK823.mp4</Col></Row>,
        //     age: 'Videos',
        //     address: '87MB',
        //     tags: '22,Nov 2022',
        // },
    ];

    return (
        <>
            <Table columns={columns} dataSource={data} className="customResponsiveTable" />
        </>
    )
}
