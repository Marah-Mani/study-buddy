import React, { useContext, useEffect, useState } from 'react';
import ParaText from '@/app/commonUl/ParaText';
import ShortFileName from '@/app/commonUl/ShortFileName';
import { Avatar, Button, Col, Dropdown, Image, Input, Menu, Modal, notification, Pagination, Row, Select, Space, Tag, Tooltip } from 'antd';
import { getProductCategories } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { WechatOutlined } from '@ant-design/icons';
import { getAllProductsListing } from '@/lib/commonApi';
import InfoModal from './InfoModal';
import Cookies from 'js-cookie';
import axios from 'axios';
import './style.css';
import ChatContext from '@/contexts/ChatContext';
import { useRouter } from 'next/navigation';
import AuthContext from '@/contexts/AuthContext';
import { BiShekel } from 'react-icons/bi';
import { CiSearch } from 'react-icons/ci';
import Link from 'next/link';
import { IoMdArrowDropdown } from 'react-icons/io';
import ShortFileTitleName from '@/app/commonUl/ShortFileTitleName';
interface Props {
    activeKey: string;
}

export default function MarketPlace({ activeKey }: Props) {
    const [allProducts, setAllProducts] = useState<any>([]);
    const [searchInput, setSearchInput] = useState('');
    const [category, setCategory] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState<any>('');
    const [subCategory, setSubCategory] = useState<any>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalProducts, setTotalProducts] = useState(0);
    const [infoModal, setInfoModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const token = Cookies.get('session_token');
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
    };

    const fetchData = async () => {
        try {
            const searchObject = {
                category: selectedCategory,
                search: searchInput,
                subCategory: subCategory._id,
                page: currentPage,
                pageSize
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
    };

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
    };

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

    const handleCategoryChange = (e: any) => {
        if (e.key == 'all') {
            setSelectedCategory('');
            setSubCategory('');
            return;
        }
        const selected: any = category.categories.find((item: any) => item._id === e.key);
        setSelectedCategory(selected);
    };

    const handleSubCategory = (e: any) => {
        const selected: any = category.subCategories.find((item: any) => item._id === e.key);
        setSubCategory(selected);
    };


    return (
        <>
            <Row>
                <Col xs={24} sm={24} md={4} lg={4} xl={4} xxl={12}></Col>
                <Col xs={24} sm={24} md={20} lg={20} xl={20} xxl={12} className="textEnd markitPlace">
                    <Space wrap className="menuStyle">
                        <Dropdown
                            overlay={
                                <div style={{ border: '2px solid #f1a638', borderRadius: '8px' }}>
                                    <Menu onClick={handleCategoryChange} >
                                        <Menu.Item key="all" className="hovercolor">
                                            All
                                        </Menu.Item>
                                        {category.categories?.map((item: any) => (
                                            <Menu.Item key={item._id} className="hovercolor">
                                                {item.name}
                                            </Menu.Item>
                                        ))}
                                    </Menu>
                                </div>
                            }
                        >
                            <Button
                                style={{
                                    width: '250px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >

                                    <>
                                        <span
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {selectedCategory
                                                ?
                                                selectedCategory.name
                                                : 'Select Department'}
                                        </span>
                                    </>
                                </span>
                                <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                            </Button>
                        </Dropdown>
                        <Dropdown
                            overlay={
                                <div style={{ border: '2px solid #f1a638', borderRadius: '8px' }}>
                                    <Menu onClick={handleSubCategory}>
                                        {selectedCategory
                                            ? category.subCategories
                                                ?.filter((item: any) => item.categoryId == selectedCategory._id)
                                                .map((item: any) => (
                                                    <Menu.Item key={item._id} className="hovercolor">
                                                        {item.name}
                                                    </Menu.Item>
                                                )) : []}
                                    </Menu>
                                </div>
                            }
                        >
                            <Button
                                style={{
                                    width: '250px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span
                                    style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <>
                                        <span
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {subCategory
                                                ?
                                                subCategory.name
                                                : 'Select Department'}
                                        </span>
                                    </>
                                </span>
                                <IoMdArrowDropdown style={{ marginLeft: 8 }} />
                            </Button>
                        </Dropdown>
                        <Input
                            allowClear
                            suffix={<CiSearch />}
                            placeholder="Search"
                            style={{ width: '100%', borderRadius: '30px' }}
                            className="buttonClass"
                            onChange={(e) => setSearchInput(e.target.value)}
                        />

                    </Space>
                </Col>
            </Row>
            <div className="gapMarginTopTwo"></div>
            <Row gutter={[16, 16]}>
                {allProducts.map((data: any) => (
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6} key={data._id}>
                        <div className="product-grid">
                            <div className="product-image">
                                <a className="image" onClick={() => handleDetail(data)}>
                                    {data?.images.length ?
                                        <Image
                                            src={

                                                `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${data?.images[0]?.name}`
                                            }
                                        />
                                        :
                                        <Avatar shape={'square'} size={200} style={{ width: '100%' }}>Product</Avatar>}
                                </a>
                            </div>
                            <br />
                            <Row align="middle" onClick={() => handleDetail(data)}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} style={{ marginBottom: '10px' }}>
                                    <div className="product-content">
                                        <ParaText
                                            size="small"
                                            color="secondaryColor"
                                            className="title"
                                            fontWeightBold={900}
                                        >
                                            <ShortFileTitleName fileName={data.title} short={35} />
                                        </ParaText>
                                    </div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <ParaText size="textGraf" color="black" className="title" fontWeightBold={600}>
                                        <span className='description'> description :</span>  &nbsp;
                                        <span style={{ color: 'rgb(241, 166, 56)', fontWeight: '400' }}>
                                            <ShortFileName fileName={data.description} short={90} />
                                        </span>
                                    </ParaText>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <ParaText
                                        size="textGraf"
                                        color="secondaryColor"
                                        className="title"
                                        fontWeightBold={600}
                                    >
                                        Category :
                                        <ParaText size="extraSmall" color="primaryColor">
                                            <span style={{ fontWeight: '400', fontSize: '14px' }}>  {data.categoryId?.name}</span>
                                        </ParaText>
                                    </ParaText>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className='marginFixed'>
                                    <ParaText
                                        size="textGraf"
                                        color="secondaryColor"
                                        className="title"
                                        fontWeightBold={600}
                                    >
                                        Sub-category :{' '}
                                        <ParaText size="extraSmall" color="primaryColor">
                                            {data.subCategoryId?.name}{' '}
                                        </ParaText>
                                    </ParaText>
                                </Col>
                            </Row>
                            <br />
                            <div className='bottomFixed'>
                                <Row align="middle">
                                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                        <Row>
                                            <Col
                                                xs={24}
                                                sm={24}
                                                md={24}
                                                lg={24}
                                                xl={24}
                                                xxl={24}
                                                onClick={() => handleDetail(data)}
                                            >
                                                <div className="product-content" style={{ display: 'flex' }}>
                                                    <div className="price">
                                                        {data.discountPrice != 'undefined' ? (
                                                            <>
                                                                <BiShekel
                                                                    size={25}
                                                                />
                                                                <p>{data.discountPrice}</p>
                                                                &nbsp;
                                                                &nbsp;
                                                                <span>
                                                                    <BiShekel
                                                                        size={25}
                                                                    />
                                                                    {data.price}
                                                                </span>
                                                            </>
                                                        ) : (

                                                            `${data.price}`
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                            {data.discountPrice != 'undefined' ? (
                                                <Col
                                                    xs={24}
                                                    sm={24}
                                                    md={24}
                                                    lg={24}
                                                    xl={24}
                                                    xxl={24}
                                                    style={{ marginTop: '10px' }}
                                                    className=""
                                                    onClick={() => handleDetail(data)}
                                                >
                                                    <span color="default" className="offerPopup">
                                                        {calculatePercentageOff(data.price, data.discountPrice)}% off
                                                    </span>
                                                </Col>
                                            ) : null}
                                        </Row>
                                    </Col>
                                    <Col
                                        xs={24}
                                        className="textEnd"
                                        sm={24}
                                        md={data.discountPrice !== 'undefined' ? 12 : 12}
                                        lg={data.discountPrice !== 'undefined' ? 12 : 12}
                                        xl={data.discountPrice !== 'undefined' ? 12 : 12}
                                        xxl={data.discountPrice !== 'undefined' ? 12 : 12}
                                    >
                                        <div onClick={() => handleSubmit(data)} className="imageChat" style={{ cursor: 'pointer' }}>
                                            <Tooltip
                                                title={<span style={{ color: 'black', fontWeight: 600 }}>Chat now</span>}
                                                color={'#EDF1F5'}
                                            >
                                                <img src="/icons/yellowbubble-chat.png" alt="" />
                                            </Tooltip>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
            <div className="gapMarginTopOne"></div>
            <div className="pagination-container textEnd">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalProducts}
                    onChange={handlePageChange}
                    showSizeChanger
                />
            </div>
            <Modal title={' '} className='popupStyle' open={infoModal} onCancel={() => setInfoModal(false)} footer={null} width={890}>
                <InfoModal product={selectedProduct} />
            </Modal>
        </>
    );
}
