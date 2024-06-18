import React, { useContext, useEffect, useState } from 'react'
import ParaText from '@/app/commonUl/ParaText';
import ShortFileName from '@/app/commonUl/ShortFileName';
import { Col, Image, Input, Pagination, Row, Select, Space, Tag, Tooltip } from 'antd';
import AuthContext from '@/contexts/AuthContext';
import { getProductCategories } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { WechatOutlined } from '@ant-design/icons';
import { getAllProductsListing } from '@/lib/commonApi';

interface Props {
    activeKey: string;
}

export default function MarketPlace({ activeKey }: Props) {
    const [allProducts, setAllProducts] = useState<any>([]);
    const [searchInput, setSearchInput] = useState('')
    const [category, setCategory] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchData();
    }, [user, activeKey, searchInput, selectedCategory, subCategory, currentPage, pageSize]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await getProductCategories();
            if (res.status == true) {
                setCategory(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const fetchData = async () => {
        try {
            const searchObject = {
                category: selectedCategory,
                search: searchInput,
                subCategory,
                page: currentPage,
                pageSize,
            };
            if (user?.role != 'admin') {

            }
            const res = await getAllProductsListing(searchObject);
            if (res.status == true) {
                setAllProducts(res.data.products);
                setTotalProducts(res.data.total);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    function calculatePercentageOff(originalPrice: number, discountedPrice: number) {
        const discount = originalPrice - discountedPrice;
        const percentageOff = (discount / originalPrice) * 100;
        return percentageOff.toFixed(2); // returns the percentage off rounded to 2 decimal places
    }

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) {
            setPageSize(pageSize);
        }
    };

    return (
        <>
            <div className='gapMarginTopTwo'></div>
            <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                    <div className="largeTopMargin"></div>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        Market Place
                    </ParaText>
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="textEnd">
                    <Space>
                        <Select
                            style={{ height: '40px' }}
                            placeholder={'Select a category'}
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            options={
                                category.categories?.map((item: any) => {
                                    return {
                                        value: item._id,
                                        label: item.name
                                    }
                                })
                            }
                            onChange={(value: string) => setSelectedCategory(value)}
                        />
                        <Select
                            style={{ height: '40px' }}
                            placeholder={'Select a sub-category'}
                            showSearch
                            allowClear
                            optionFilterProp="children"
                            options={
                                selectedCategory ?
                                    category.subCategories
                                        ?.filter((item: any) => item.categoryId == selectedCategory)
                                        .map((item: any) => ({
                                            value: item._id,
                                            label: item.name
                                        })) : []
                            }
                            onChange={(value: string) => setSubCategory(value)}
                        />
                        <Input placeholder="Search" style={{ height: '38px', width: '100%' }} className='buttonClass' onChange={(e) => setSearchInput(e.target.value)} />
                    </Space>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                {allProducts.map((data: any) => (
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={data._id}>
                        <div className="product-grid">
                            <div className="product-image">
                                <a className="image">
                                    <Image src={
                                        data?.images.length > 0
                                            ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${data?.images[0]?.name}`
                                            : `/images/avatar.png`
                                    }
                                        width={300}
                                        height={250}
                                    />
                                </a>
                            </div>

                            <Row align='middle'>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <div className="product-content">
                                        <ParaText size='textGraf' className="title" fontWeightBold={600}><ShortFileName fileName={data.title} short={40} /> </ParaText>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <span><ShortFileName fileName={data.description} short={90} /></span>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <ParaText size='textGraf' className="title" fontWeightBold={600}>Category : {data.categoryId.name}</ParaText>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <ParaText size='textGraf' className="title" fontWeightBold={600}>Sub-category : {data.subCategoryId.name}</ParaText>
                                </Col>
                            </Row>
                            <Row align='middle'>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                    <div className="product-content">
                                        <div className="price">${data.discountPrice} <span>${data.price}</span></div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                    <Tag color="geekblue">
                                        {calculatePercentageOff(data.price, data.discountPrice)}% off
                                    </Tag>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className='textEnd'>
                                    <Tooltip
                                        title={<span style={{ color: 'black', fontWeight: 600 }}>Chat now</span>}
                                        color={'#EDF1F5'}
                                    >
                                        <WechatOutlined style={{ fontSize: '53px', cursor: 'pointer' }} />
                                    </Tooltip>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                ))}

            </Row>
            <div className="gapMarginTopOne"></div>
            <div className="pagination-container textEnd" >
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalProducts}
                    onChange={handlePageChange}
                    showSizeChanger
                />
            </div>
        </>
    )
}
