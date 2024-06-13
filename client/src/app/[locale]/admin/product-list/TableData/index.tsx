import React, { useState } from 'react';
import { Space, Table, Tag, Image } from 'antd';
import type { TableColumnsType } from 'antd';

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

const data: DataType[] = [
    {
        key: '1',
        product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
        category: <Tag bordered={false} color="blue">Clothing</Tag>,
        price: '$1299',
        stock: '283',
        gender: 'Male',
        seller: 'Apilla.co.in',
        published: '24,Nov 2022 - 04:42PM',

    },
    {
        key: '2',
        product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
        category: <Tag bordered={false} color="blue">Clothing</Tag>,
        price: '$1299',
        stock: '283',
        gender: 'Male',
        seller: 'Apilla.co.in',
        published: '24,Nov 2022 - 04:42PM',
    },
    {
        key: '3',
        product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
        category: <Tag bordered={false} color="blue">Clothing</Tag>,
        price: '$1299',
        stock: '283',
        gender: 'Male',
        seller: 'Apilla.co.in',
        published: '24,Nov 2022 - 04:42PM',
    },
    {
        key: '4',
        product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
        category: <Tag bordered={false} color="blue">Clothing</Tag>,
        price: '$1299',
        stock: '283',
        gender: 'Male',
        seller: 'Apilla.co.in',
        published: '24,Nov 2022 - 04:42PM',
    },
    {
        key: '5',
        product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
        category: <Tag bordered={false} color="blue">Clothing</Tag>,
        price: '$1299',
        stock: '283',
        gender: 'Male',
        seller: 'Apilla.co.in',
        published: '24,Nov 2022 - 04:42PM',
    },

    {
        key: '6',
        product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
        category: <Tag bordered={false} color="blue">Clothing</Tag>,
        price: '$1299',
        stock: '283',
        gender: 'Male',
        seller: 'Apilla.co.in',
        published: '24,Nov 2022 - 04:42PM',
    },
    {
        key: '7',
        product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
        category: <Tag bordered={false} color="blue">Clothing</Tag>,
        price: '$1299',
        stock: '283',
        gender: 'Male',
        seller: 'Apilla.co.in',
        published: '24,Nov 2022 - 04:42PM',
    },
    {
        key: '8',
        product: <Space><Image width={50} height={50} preview={false} alt='' src="https://nextjs.spruko.com/ynex-js/preview/assets/images/ecommerce/png/1.png" /><span>DapZem & Co Blue Hoodie</span></Space>,
        category: <Tag bordered={false} color="blue">Clothing</Tag>,
        price: '$1299',
        stock: '283',
        gender: 'Male',
        seller: 'Apilla.co.in',
        published: '24,Nov 2022 - 04:42PM',
    },

];

// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
};

export default function TableData() {
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
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
