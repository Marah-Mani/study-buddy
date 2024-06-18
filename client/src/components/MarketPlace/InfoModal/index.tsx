import ParaText from '@/app/commonUl/ParaText'
import { Col, Image, Row, Tag, Tooltip } from 'antd'
import React from 'react'
import { WechatOutlined, ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.css'
interface Props {
    product: any
}

export default function InfoModal({ product }: Props) {

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
        responsive: [
            {
                breakpoint: 768, // Adjust breakpoint for mobile devices
                settings: {
                    slidesToShow: 1, // Display one slide at once in mobile view
                    slidesToScroll: 1,
                    vertical: false // Disable vertical property for mobile view
                }
            },
            {
                breakpoint: 767, // Adjust breakpoint for mobile devices
                settings: {
                    slidesToShow: 1, // Display one slide at once in mobile view
                    slidesToScroll: 1,
                    vertical: false // Disable vertical property for mobile view
                }
            }
        ]
    };

    return (
        <>
            <Row gutter={18}>
                <Col md={12}>
                    <Slider {...settings}>
                        {product.images.map((image: any, index: any) => (
                            <div key={index}>
                                <Image
                                    src={
                                        product.images.length > 0
                                            ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/productImages/original/${image.name}`
                                            : `/images/avatar.png`
                                    }
                                    alt="item-images"
                                    preview={false}
                                    height={300}
                                    style={{ width: '100%', borderRadius: '10px' }}
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
                                <ParaText size='small' color='black' className="title" fontWeightBold={600}>{product.title}</ParaText>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                            <span>{product.description}</span>
                        </Col>
                        <Col xs={24} sm={24} md={9} lg={9} xl={9} xxl={9}>
                            <ParaText size='textGraf' color='black' className="title" fontWeightBold={600}>Category : {product.categoryId.name}</ParaText>
                        </Col>
                        <Col xs={24} sm={24} md={15} lg={15} xl={15} xxl={15}>
                            <ParaText size='textGraf' color='black' className="title" fontWeightBold={600}>Sub-category : {product.subCategoryId.name}</ParaText>
                        </Col>
                    </Row>
                    <Row align='middle'>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                            <div className="product-content">
                                <div className="price">
                                    {product.discountPrice != "undefined" ?
                                        <>
                                            ${product.discountPrice} <span>${product.price}</span>
                                        </>
                                        :
                                        `$${product.price}`
                                    }
                                </div>

                            </div>
                        </Col>
                        {product.discountPrice != "undefined" ?
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                <Tag color="geekblue">
                                    {calculatePercentageOff(product.price, product.discountPrice)}% off
                                </Tag>
                            </Col>
                            : null}
                        <Col
                            xs={24}
                            sm={24}
                            md={product.discountPrice !== "undefined" ? 24 : 12}
                            lg={product.discountPrice !== "undefined" ? 24 : 12}
                            xl={product.discountPrice !== "undefined" ? 24 : 12}
                            xxl={product.discountPrice !== "undefined" ? 24 : 12}
                            className='textEnd'
                        >
                            <Tooltip
                                title={<span style={{ color: 'black', fontWeight: 600 }}>Chat now</span>}
                                color={'#EDF1F5'}
                                placement='left'
                            >
                                <WechatOutlined style={{ fontSize: '30px', cursor: 'pointer', color: '#4cb54c' }} />
                            </Tooltip>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    )
}
