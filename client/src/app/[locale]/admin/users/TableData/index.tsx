import React, { useEffect, useState } from 'react';
import { Space, Table, Image, message, Popconfirm, Switch } from 'antd';
import type { TableColumnsType } from 'antd';
import { deleteUser, getAllUsers, updateUserStatus } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import TextCapitalize from '@/app/commonUl/TextCapitalize';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface DataType {
    key: string;
    name: any;
    email: any;
    phoneNumber: any;
    department: any;
    interestedIn: any;
    gender: any;
    status: boolean;
}

interface Props {
    reload: boolean;
    onEdit: any;
    searchInput: any;
}

export default function TableData({ reload, onEdit, searchInput }: Props) {
    const [allProducts, setAllProducts] = useState<any>([]);

    useEffect(() => {
        fetchData();
    }, [reload, searchInput]);

    const fetchData = async () => {
        try {
            const res = await getAllUsers(searchInput);
            if (res.status === true) {
                setAllProducts(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleStatusToggle = async (checked: boolean, userId: string) => {
        try {
            const data = {
                userId,
                status: checked ? 'active' : 'inactive',
            };
            const res = await updateUserStatus(data);
            if (res.status === true) {
                message.success(res.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone No.',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'Department',
            dataIndex: 'department',
        },
        {
            title: 'Interested-In',
            dataIndex: 'interestedIn',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <span className='edit'><AiOutlineEdit style={{ cursor: 'pointer' }} onClick={() => handleEdit(record.key)} /></span>
                    <span className='delete'>
                        <Popconfirm
                            title="Delete User"
                            description="Are you sure you want to delete this user?"
                            onConfirm={() => handleDelete(record.key)}
                            okText="Yes"
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <RiDeleteBin5Fill style={{ cursor: 'pointer' }} />
                        </Popconfirm>
                    </span>
                </Space>
            )
        }
    ];

    const handleEdit = (id: any) => {
        // onEdit(id);
    };

    const handleDelete = async (id: any) => {
        try {
            const res = await deleteUser(id);
            if (res.status === true) {
                message.success(res.message);
                fetchData();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const data: DataType[] = allProducts.map((data: any) => ({
        key: data._id,
        name: <Space>
            <Image
                src={data?.image ?
                    `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${data?.image}`
                    : `/images/avatar.png`} width={50} height={50} alt={data.name} style={{ borderRadius: '5px' }} /><span>{data.name}</span></Space>,
        email: data.email,
        phoneNumber: data.phoneNumber,
        department: data.departmentId.departmentName,
        interestedIn: <TextCapitalize text={data.interestedIn} />,
        gender: <TextCapitalize text={data.gender} />,
        status: (
            <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                defaultChecked={data.status == 'active' ? true : false}
                onChange={(checked) => handleStatusToggle(checked, data._id)}
            />)
    }));

    return (
        <div>
            <Table
                className='customResponsiveTable'
                columns={columns}
                bordered
                dataSource={data}
            />
        </div>
    );
}
