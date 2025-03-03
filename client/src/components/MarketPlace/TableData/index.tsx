import React, { useContext, useEffect, useState } from 'react';
import { Space, Table, Image, message, Popconfirm, Tag, Col, Rate, Row, Tooltip, Avatar } from 'antd';
import type { TableColumnsType } from 'antd';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { deleteProduct } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getUserProducts } from '@/lib/commonApi';
import { getAllProducts } from '@/lib/adminApi';
import { BiShekel } from 'react-icons/bi';
import { ProjectOutlined } from '@ant-design/icons'

interface DataType {
    key: React.Key;
    product: any;
    title: any;
    category: any;
    price: any;
}

interface Props {
    reload: boolean;
    onEdit: any;
    searchInput: any;
}

export default function TableData({ reload, onEdit, searchInput }: Props) {
    const [allProducts, setAllProducts] = useState<any>([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) fetchData();
    }, [user, reload, searchInput]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const searchObject = {
                search: searchInput,
                userId: user?._id
            }

            if (user?.role != 'admin') {
                const res = await getUserProducts(searchObject);
                if (res.status == true) {
                    setAllProducts(res.data.products);
                    setLoading(false);
                }
            } else {
                const res = await getAllProducts(searchInput);
                if (res.status == true) {
                    setAllProducts(res.data);
                    setLoading(false);
                }
            }

        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Image',
            dataIndex: 'image',
            width: '10%',
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: '40%',
        },

        {
            title: 'Category',
            dataIndex: 'category',
            width: '15%',
        },
        {
            title: 'Sub-category',
            dataIndex: 'subCategory',
            width: '15%',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: '10%',
        },
        {
            title: 'Discount Price',
            dataIndex: 'discountPrice',
            width: '15%',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            fixed: 'right',
            width: '10%',
            render: (text, record) => (
                <Space size="middle">
                    <span className='edit'>  <FaEdit style={{ cursor: 'pointer' }} onClick={() => handleEdit(record.key)} /></span>
                    <span className='delete'>
                        <Popconfirm
                            title="Delete Product"
                            description="Are you sure you want to delete this product?"
                            onConfirm={() => { handleDelete(record.key) }}
                            okText="Yes"
                            cancelText="No"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        >
                            <RiDeleteBin6Line style={{ cursor: 'pointer' }} />
                        </Popconfirm>
                    </span>
                </Space>
            )
        }
    ];

    const handleEdit = (id: any) => {
        onEdit(id);
    }

    const handleDelete = async (id: any) => {
        try {
            const res = await deleteProduct(id);
            if (res.status == true) {
                message.success(res.message);
                fetchData();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const data: DataType[] = allProducts?.map((data: any) => {
        return {
            key: data._id,
            image: <Space>
                <Tooltip
                    color={'#EDF3FA'}
                    title={
                        data?.images.length ?
                            <Image
                                src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${data?.images[0]?.name}`}
                                width={235}
                                height={235}
                                alt='product'
                                preview={false}
                            />
                            :
                            <Avatar size={235} shape={'square'}>Product</Avatar>
                    }
                >
                    {data?.images.length ?
                        <Image src={
                            `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${data?.images[0]?.name}`

                        } width={50} height={50} alt='product' preview={false} style={{ borderRadius: '5px' }} />
                        :
                        <Avatar size={40} shape={'square'}>Product</Avatar>}
                </Tooltip>
            </Space >,
            title: data.title,
            category: data.categoryId?.name,
            subCategory: data.subCategoryId?.name,
            price: <> <div style={{ display: 'flex', alignItems: 'center' }}> <span><BiShekel size={20} style={{ color: 'green', display: 'flex', alignItems: 'center' }} /></span>
                <span>{data?.price}</span>
            </div> </>,
            discountPrice: data.discountPrice === 'undefined' ? 'N/A' : <> <div style={{ display: 'flex', alignItems: 'center' }}> <span><BiShekel size={20} style={{ color: 'green', display: 'flex', alignItems: 'center' }} /></span>
                <span>{data?.discountPrice}</span>
            </div> </>,
            status: (
                data.status == 'active' ?
                    <Tag color="green">Active</Tag>
                    :
                    <Tag color="volcano">Inactive</Tag>
            )
        }
    })



    return (
        <div>
            <div className="table-container">
                <Table
                    columns={columns}
                    bordered
                    dataSource={data}
                    loading={loading}
                />
            </div>
        </div>
    );
}
