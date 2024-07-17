import React, { useEffect, useState } from 'react';
import { Space, Table, Image, Switch } from 'antd';
import type { TableColumnsType } from 'antd';
import { getAllUsersStudyBuddy } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import TextCapitalize from '@/app/commonUl/TextCapitalize';

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

export default function TableData({ reload, searchInput }: Props) {
    const [allProducts, setAllProducts] = useState<any>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [reload, searchInput]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAllUsersStudyBuddy({ search: searchInput });
            if (res.status === true) {
                setAllProducts(res.data);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
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
        }
    ];

    const data: DataType[] = allProducts.map((data: any) => ({
        key: data._id,
        name: <Space>
            <Image
                src={data?.image ?
                    `${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${data?.image}`
                    : `/images/avatar.png`} width={30} height={30} alt={data.name} style={{ borderRadius: '5px' }} /><span>{data.name}</span>
        </Space>,
        email: data.email,
        department: data.departmentId?.departmentName || 'N/A',
        interestedIn: <TextCapitalize text={data.interestedIn} />,
        gender: <TextCapitalize text={data.gender} />,
        status: data.status || 'N/A',
    }));

    return (
        <div>
            <Table
                className='customResponsiveTable'
                columns={columns}
                bordered
                dataSource={data}
                loading={loading}
            />
        </div>

    );
}
