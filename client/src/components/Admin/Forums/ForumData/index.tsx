import AuthContext from '@/contexts/AuthContext';
import { deleteForum, getAllForums } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Button, message, Popconfirm, Table } from 'antd'
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import { DeleteOutlined } from '@ant-design/icons';

interface Props {
    activeKey: string,
    reload: any,
    onEdit: any,
    getData: any,
    filterData: any
}

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
}
export default function ForumData({ activeKey, onEdit, reload, getData, filterData }: Props) {

    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey, reload])

    const fetchData = async () => {
        try {
            const searchObject = {
                userId: user?._id,
            }
            const res = await getAllForums(searchObject);
            if (res.status == true) {
                getData(res.data)
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    const handleDelete = async (item: any) => {
        try {
            const res = await deleteForum({ forumId: item._id });
            if (res.status === true) {
                message.success(res.message);
                fetchData();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const data: DataType[] = filterData.map((data: any, index: string) => {
        return {
            key: data._id,
            title: (
                <>
                    <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/admin/questions/${data.slug}`} key={index}>
                        {data.title}
                    </Link>
                </>
            ),
            category: (data?.categoryId?.name),
            views: data.viewCount,
            likes: data.likes.length ?? 0,
            disLikes: data.dislikes.length ?? 0,
            action: (
                <>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div>
                            <Button type='text' ghost onClick={() => onEdit(data)}><FaEdit /></Button>
                        </div>
                        <div>
                            <Popconfirm
                                title="Are you sure you want to delete this forum?"
                                onConfirm={() => { handleDelete(data) }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button

                                >
                                    <DeleteOutlined />
                                </Button>
                            </Popconfirm>
                        </div>
                    </div>
                </>
            )
        }
    })

    const columns: ColumnsType<DataType> = [
        { title: 'Title', dataIndex: 'title' },
        { title: 'Category', dataIndex: 'category' },
        { title: 'Views', dataIndex: 'views' },
        { title: 'Likes', dataIndex: 'likes' },
        { title: 'Dislikes', dataIndex: 'disLikes' },
        { title: 'Action', dataIndex: 'action', width: '100px' }
    ];


    return (
        <>
            <Table columns={columns} loading={loading} bordered dataSource={data} />
        </>
    )
}
