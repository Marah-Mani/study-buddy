import ParaText from '@/app/commonUl/ParaText';
import { Col, Image, Row, Tag, Tooltip } from 'antd';
import React from 'react';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.css';
import { BiShekel } from 'react-icons/bi';
import ShortFileTitleName from '@/app/commonUl/ShortFileTitleName';

interface Props {
    product: any;
    handleChat: any;
}

export default function InfoModal({ product, handleChat }: Props) {

    function calculatePercentageOff(originalPrice: number, discountedPrice: number) {
        const discount = originalPrice - discountedPrice;
        const percentageOff = (discount / originalPrice) * 100;
        return percentageOff.toFixed(2); // returns the percentage off rounded to 2 decimal places
    }

    const settings = {
        dots: true,
        arrows: true, // Show arrows navigation
        prevArrow: <ArrowLeftOutlined className="slick-prev" onClick={undefined} />,
        nextArrow: <ArrowRightOutlined className="slick-next" onClick={undefined} />,
        infinite: true,
        speed: 500,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        // responsive: [
        //     {
        //         breakpoint: 768, // Adjust breakpoint for mobile devices
        //         settings: {
        //             slidesToShow: 1, // Display one slide at once in mobile view
        //             slidesToScroll: 1,
        //             vertical: false // Disable vertical property for mobile view
        //         }
        //     },
        //     {
        //         breakpoint: 767, // Adjust breakpoint for mobile devices
        //         settings: {
        //             slidesToShow: 1, // Display one slide at once in mobile view
        //             slidesToScroll: 1,
        //             vertical: false // Disable vertical property for mobile view
        //         }
        //     }
        // ]
    };

    return (
        <>
            <Row gutter={18}>
                <Col md={12}>
                    <Slider {...settings}>
                        {product.images.map((image: any, index: any) => (
                            <div key={index} className='' >
                                <Image
                                    src={
                                        product.images.length > 0
                                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/productImages/original/${image.name}`
                                            : `/images/avatar.png`
                                    }
                                    alt="item-images"
                                    preview={false}
                                    height={300}
                                    style={{ width: '100%', borderRadius: '10px', border: '2px solid #344734' }}
                                />
                            </div>
                        ))}
                    </Slider>
                    <div className="gapMarginTopOne"></div>
                </Col>
                <Col md={12}>
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <div className="product-content">
                                <ParaText size="small" color="black" className="title" fontWeightBold={600}>
                                    <ShortFileTitleName fileName={product.title} short={35} />
                                </ParaText>
                                <div className="gapMarginTopOne"></div>
                                <ParaText size="textGraf" color="black" className="title" fontWeightBold={600}>
                                    <span className='description'> Description:</span>  &nbsp; <span style={{ color: 'rgb(241, 166, 56)', fontWeight: '400' }}>{product.description}</span>
                                </ParaText>
                                <div className="gapMarginTopOne"></div>
                                <ParaText size="textGraf" color="black" className="title" fontWeightBold={600}>
                                    <span className='description'>  Category :</span>
                                    <span style={{ color: '#f1a058', fontWeight: '400', fontSize: '14px' }}>{product?.categoryId?.name}</span>
                                </ParaText>
                                <div className="gapMarginTopOne"></div>
                                <ParaText size="textGraf" color="black" className="title" fontWeightBold={600}>
                                    <span className='description'>   Sub-category :</span>

                                    <span style={{ color: '#f1a058', fontWeight: '400', fontSize: '14px' }}> {product?.subCategoryId?.name}</span>
                                </ParaText>
                                <div className="gapMarginTopOne"></div>
                            </div>
                        </Col>
                    </Row >

                    <Row align="middle">
                        <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <div className="product-content" style={{ display: 'flex' }}>
                                        <div className="price">
                                            {product.discountPrice != 'undefined' ? (
                                                <>
                                                    <BiShekel
                                                        size={25}
                                                    />
                                                    <p>  {product.discountPrice}</p>
                                                    <span>
                                                        <BiShekel
                                                            size={25}
                                                        />
                                                        {product.price}
                                                    </span>
                                                </>
                                            ) : (
                                                `$${product.price}`
                                            )}
                                        </div>
                                    </div>
                                </Col>
                                {product.discountPrice != 'undefined' ? (
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="">
                                        <br />
                                        <Tag className="offer">
                                            {calculatePercentageOff(product.price, product.discountPrice)}% off
                                        </Tag>
                                    </Col>
                                ) : null}
                            </Row>
                        </Col>
                        <Col
                            xs={24}
                            className="textEnd"
                            sm={24}
                            md={product.discountPrice !== 'undefined' ? 12 : 12}
                            lg={product.discountPrice !== 'undefined' ? 12 : 12}
                            xl={product.discountPrice !== 'undefined' ? 12 : 12}
                            xxl={product.discountPrice !== 'undefined' ? 12 : 12}
                        >
                            <br />
                            <Tooltip
                                className="imageChat"
                                title={<span style={{ color: 'black', fontWeight: 600 }}>Chat now</span>}
                                color={'#EDF1F5'}
                                placement="left"
                            >
                                <br />
                                <img src="/icons/yellowbubble-chat.png" alt="chat" onClick={() => handleChat(product)} />
                            </Tooltip>
                        </Col>
                    </Row>
                </Col >
            </Row >
        </>
    );
}
