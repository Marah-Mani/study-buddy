import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Image } from 'antd';
import type { TableColumnsType } from 'antd';
import { getAllProducts } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';

interface DataType {
    key: React.Key;
    product: any;
    category: any;
    price: any;
    stock: any;
    gender: any;
    seller: any;
    published: any;
}


// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
};

export default function TableData() {
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [allProducts, setAllProducts] = useState<any>([]);

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const res = await getAllProducts();
            if (res.status == true) {
                setAllProducts(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Product',
            dataIndex: 'product',
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
        },
        {
            title: 'Seller',
            dataIndex: 'seller',
        },
        {
            title: 'Published',
            dataIndex: 'published',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text: string, record: DataType) => (
                <span>
                    {/* Example tags rendering */}
                    {['Edit', 'Delete'].map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </span>
            ),
        },
    ];

    const data: DataType[] = allProducts.map((data: any) => {
        return {
            key: data._id,
            product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>{data.name}</span></Space>,
            category: <Tag bordered={false} color="blue">{data.category}</Tag>,
            price: data.title,
            stock: data.stock,
            gender: data.gender,
            seller: data.seller,
            published: data.published,
        }
    })

    //  [
    //     {
    //         key: '1',
    //         product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
    //         category: <Tag bordered={false} color="blue">Clothing</Tag>,
    //         price: '$1299',
    //         stock: '283',
    //         gender: 'Male',
    //         seller: 'Apilla.co.in',
    //         published: '24,Nov 2022 - 04:42PM',

    //     },



    return (
        <div>
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                bordered
                dataSource={data}
            />
        </div>
    );
}
