import React, { useContext, useEffect, useState } from 'react'
import ParaText from '@/app/commonUl/ParaText';
import ShortFileName from '@/app/commonUl/ShortFileName';
import { Col, Image, Input, Modal, notification, Pagination, Row, Select, Space, Tag, Tooltip } from 'antd';
import { getProductCategories } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { WechatOutlined } from '@ant-design/icons';
import { getAllProductsListing } from '@/lib/commonApi';
import InfoModal from './InfoModal';
import Cookies from 'js-cookie';
import axios from 'axios';
import './style.css'
import ChatContext from '@/contexts/ChatContext';
import { useRouter } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
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
    const [infoModal, setInfoModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const token = Cookies.get('session_token')
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

    const handleDetail = (data: any) => {
        setInfoModal(true);
        setSelectedProduct(data);
    }

    const router = useRouter();


    const getFirstName = (fullName: any) => {
        const nameParts = fullName.trim().split(' ');
        return nameParts[0];
    };
    const handleSubmit = async (data: any) => {
        try {
            const groupChatName = `${getFirstName(user?.name)}-${getFirstName(data.createdBy.name)}-Market Place`;
            const selectedUsers = [
                {
                    _id: data.createdBy._id,
                }
            ]
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/common/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u: any) => u._id)),
                    type: 'marketChat'
                },
                config
            );
            router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/${user?.role}/chat`);

        } catch (error) {
            notification.error({
                message: "Failed to Create the Chat!"
            });
        }
    };

    return (
        <>
            <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <ParaText size="small" fontWeightBold={600} color="primaryColor">
                        Market Place
                    </ParaText>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className="textEnd markitPlace">
                    <Space wrap>
                        <Select
                            style={{ height: '35px' }}
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
                            style={{ height: '35px' }}
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
                        <Input placeholder="Search" style={{ height: '35px', width: '100%', borderRadius: '0px' }} className='buttonClass' onChange={(e) => setSearchInput(e.target.value)} />
                    </Space>
                </Col>
            </Row>
            <div className='gapMarginTopTwo'></div>
            <Row gutter={[16, 16]}>
                {allProducts.map((data: any) => (
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={data._id}>
                        <div className="product-grid">
                            <div className="product-image">
                                <a className="image" onClick={() => handleDetail(data)}>
                                    <Image src={
                                        data?.images.length > 0
                                            ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${data?.images[0]?.name}`
                                            : `/images/avatar.png`
                                    }
                                    />
                                </a>
                            </div>

                            <Row align='middle' onClick={() => handleDetail(data)}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <div className="product-content">
                                        <ParaText size='textGraf' color='secondaryColor' className="title" fontWeightBold={600}><ShortFileName fileName={data.title} short={35} /> </ParaText>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <span><ShortFileName fileName={data.description} short={90} /></span>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <ParaText size='textGraf' color='secondaryColor' className="title" fontWeightBold={600}>Category : {data.categoryId.name}</ParaText>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <ParaText size='textGraf' color='secondaryColor' className="title" fontWeightBold={600}>Sub-category : {data.subCategoryId.name}</ParaText>
                                </Col>
                            </Row>
                            <Row align='middle'>
                                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} onClick={() => handleDetail(data)}>
                                    <div className="product-content">
                                        <div className="price">
                                            {data.discountPrice != "undefined" ?
                                                <>
                                                    <Image preview={false} src="/icons/shekel-sign.png" alt='' width={15} />&nbsp; {data.discountPrice} <span> <Image width={15} preview={false} src="/icons/shekel-sign.png" alt='' />&nbsp;  {data.price}</span>
                                                </>
                                                :
                                                `$${data.price}`
                                            }
                                        </div>

                                    </div>
                                </Col>
                                {data.discountPrice != "undefined" ?
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd' onClick={() => handleDetail(data)}>
                                        <Tag color="#f1a638">
                                            {calculatePercentageOff(data.price, data.discountPrice)}% off
                                        </Tag>
                                    </Col>
                                    : null}
                                <Col
                                    xs={24}
                                    sm={24}
                                    md={data.discountPrice !== "undefined" ? 24 : 12}
                                    lg={data.discountPrice !== "undefined" ? 24 : 12}
                                    xl={data.discountPrice !== "undefined" ? 24 : 12}
                                    xxl={data.discountPrice !== "undefined" ? 24 : 12}
                                    className='textEnd'
                                >
                                    <Tooltip
                                        title={<span style={{ color: 'black', fontWeight: 600 }}>Chat now</span>}
                                        color={'#EDF1F5'}
                                    >
                                        <Image src="/icons/yellowbubble-chat.png" alt='' />
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
            <Modal
                title={"Item details"}
                open={infoModal}
                onCancel={() => setInfoModal(false)}
                footer={null}
                width={890}
            >
                <InfoModal
                    product={selectedProduct}
                />
            </Modal>
        </>
    )
}
