import React, { useEffect, useState } from 'react';
import { Space, Table, Image, message, Popconfirm, Tag, Col, Rate, Row } from 'antd';
import type { TableColumnsType } from 'antd';
import { deleteProduct, getAllProducts } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { AiOutlineEdit } from 'react-icons/ai';
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ParaText from '@/app/commonUl/ParaText';
import { CiSearch, CiHeart } from 'react-icons/ci';
import { FaShoppingCart } from 'react-icons/fa';
import { TbArrowsRandom } from 'react-icons/tb';
import ShortFileName from '@/app/commonUl/ShortFileName';

interface DataType {
    key: React.Key;
    product: any;
    title: any;
    category: any;
    price: any;
    stock: any;
    gender: any;
    seller: any;
    published: any;
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
            const res = await getAllProducts(searchInput);
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
        },
        {
            title: 'Title',
            dataIndex: 'title',
        },

        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Sub-category',
            dataIndex: 'subCategory',
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Discount Price',
            dataIndex: 'discountPrice',
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

    const data: DataType[] = allProducts.map((data: any) => {
        return {
            key: data._id,
            product: <Space> <Image src={
                data?.images.length > 0
                    ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${data?.images[0]?.name}`
                    : `/images/avatar.png`
            } width={50} height={50} alt='product' style={{ borderRadius: '5px' }} /></Space>,
            title: data.title,
            category: data.categoryId.name,
            subCategory: data.subCategoryId.name,
            price: data.price,
            discountPrice: data.discountPrice,
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
            />
            {/* <Row>
                {allProducts.map((data: any) => (
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={5} key={data._id}>
                        <div className="product-grid">
                            <div className="product-image">
                                <a href="#" className="image">
                                    <Image src={
                                        data?.images.length > 0
                                            ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${data?.images[0]?.name}`
                                            : `/images/avatar.png`
                                    } />
                                </a>
                                <ul className="social">
                                    <li><a href="#" data-tip="Quick View"><CiSearch /></a></li>
                                    <li><a href="#" data-tip="Compare"><TbArrowsRandom /></a></li>
                                    <li><a href="#" data-tip="Wishlist"><CiHeart /></a></li>
                                    <li><a href="#" data-tip="Add to cart"><FaShoppingCart /></a></li>
                                </ul>
                            </div>

                            <Row align='middle'>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <div className="product-content">
                                        <ParaText size='textGraf' className="title" fontWeightBold={600}><ShortFileName fileName={data.title} short={20} /> </ParaText>
                                        <ParaText size='smallExtra' className="price dBlock">Branded hoodie ethnic style</ParaText>
                                    </div>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                    <Rate allowHalf defaultValue={2.5} />
                                </Col>
                            </Row>
                            <Row align='middle'>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <div className="product-content">
                                        <div className="price">${data.discountPrice} <span>${data.price}</span></div>
                                        <div className='gapMarginTopOne'></div>
                                        <ParaText size='smallExtra' className="title "><a href="#"><Tag color="green">Offer Price $229</Tag></a></ParaText>
                                    </div>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                    <Tag color="geekblue">72% off</Tag>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                ))}

            </Row> */}

        </div>
    );
}
