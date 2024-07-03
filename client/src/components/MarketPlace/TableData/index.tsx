import React, { useContext, useEffect, useState } from 'react';
import { Space, Table, Image, message, Popconfirm, Tag, Col, Rate, Row, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { deleteProduct } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getUserProducts } from '@/lib/commonApi';
import { getAllProducts } from '@/lib/adminApi';

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
            width: '50%',
        },

        {
            title: 'Category',
            dataIndex: 'category',
            width: '10%',
        },
        {
            title: 'Sub-category',
            dataIndex: 'subCategory',
            width: '10%',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: '10%',
        },
        {
            title: 'Discount Price',
            dataIndex: 'discountPrice',
            width: '10%',
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
                    <span className='edit'>  <AiOutlineEdit style={{ cursor: 'pointer' }} onClick={() => handleEdit(record.key)} /></span>
                    <span className='delete'>
                        <Popconfirm
                            title="Delete Product"
                            description="Are you sure you want to delete this product?"
                            onConfirm={() => { handleDelete(record.key) }}
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
                        <Image
                            src={
                                data?.images.length > 0
                                    ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${data?.images[0]?.name}`
                                    : `/images/avatar.png`
                            }
                            width={235}
                            height={235}
                            alt='product'
                            preview={false}
                        />
                    }
                >
                    <Image src={
                        data?.images.length > 0
                            ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/small/${data?.images[0]?.name}`
                            : `/images/avatar.png`
                    } width={50} height={50} alt='product' preview={false} style={{ borderRadius: '5px' }} />
                </Tooltip>
            </Space>,
            title: data.title,
            category: data.categoryId.name,
            subCategory: data.subCategoryId.name,
            price: <><Image src="/icons/shekel-sign.png" width={15} height={15} preview={false} alt='' />&nbsp;{data.price}</>,
            discountPrice: data.discountPrice === 'undefined' ? 'N/A' : <><Image preview={false} src="/icons/shekel-sign.png" alt='' width={15} height={15} />&nbsp;{data.discountPrice}</>,
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
            <Table
                columns={columns}
                bordered
                dataSource={data}
                scroll={{ x: 1500 }}
                loading={loading}
            />
        </div>
    );
}
