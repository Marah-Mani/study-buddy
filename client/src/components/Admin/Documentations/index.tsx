import ParaText from '@/app/commonUl/ParaText'
import { getAllDocumentations } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Button, Card, Col, Divider, Row, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { ReadOutlined, FileTextOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function Documentations() {
    const [documents, setDocuments] = useState<any>([]);

    useEffect(() => {
        fetchData();
    }, [])
    const fetchData = async () => {
        try {
            const res = await getAllDocumentations();
            setDocuments(res.data);
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    return (
        <>
            <div className="smallTopMargin"></div>
            <Row gutter={[20, 20]}>
                <Col md={8}>
                    <Card style={{ backgroundColor: '#073e74' }}>
                        <Row>
                            <Col md={20}>
                                <ParaText size="large" fontWeightBold={600} color="white">
                                    Articles
                                </ParaText>
                                <div className="smallTopMargin"></div>
                                <span style={{ color: '#fff' }}> How little experience or technical knowledge you currently have. The web is a very big place, and if you are the typical internet user, you probably visit several websites every day.</span>
                            </Col>
                            <Col md={4}>
                                <div className="mediumTopMargin"></div>
                                <ReadOutlined style={{ fontSize: '80px', color: '#fff' }} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card style={{ backgroundColor: '#073e74' }}>
                        <Row>
                            <Col md={20}>
                                <ParaText size="large" fontWeightBold={600} color="white">
                                    Articles
                                </ParaText>
                                <div className="smallTopMargin"></div>
                                <span style={{ color: '#fff' }}> How little experience or technical knowledge you currently have. The web is a very big place, and if you are the typical internet user, you probably visit several websites every day.</span>
                            </Col>
                            <Col md={4}>
                                <div className="mediumTopMargin"></div>
                                <ReadOutlined style={{ fontSize: '80px', color: '#fff' }} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card style={{ backgroundColor: '#073e74' }}>
                        <Row>
                            <Col md={20}>
                                <ParaText size="large" fontWeightBold={600} color="white">
                                    Articles
                                </ParaText>
                                <div className="smallTopMargin"></div>
                                <span style={{ color: '#fff' }}> How little experience or technical knowledge you currently have. The web is a very big place, and if you are the typical internet user, you probably visit several websites every day.</span>
                            </Col>
                            <Col md={4}>
                                <div className="mediumTopMargin"></div>
                                <ReadOutlined style={{ fontSize: '80px', color: '#fff' }} />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Browse articles by category
            </ParaText>
            <div className="mediumTopMargin"></div>
            <Card>
                <ParaText size="small" fontWeightBold={600} color="PrimaryColor">
                    Browse Articles
                </ParaText>
                <div className="mediumTopMargin"></div>
                <Row gutter={[16, 16]} className="row" style={{ display: 'flex', flexFlow: 'row wrap' }}>
                    {documents
                        .sort((a: any, b: any) => b.titles.length - a.titles.length) // Sort documents by number of titles descending
                        .map((document: any, index: any) => {
                            const order = index + 1;
                            return (
                                <Col
                                    xs={24}
                                    sm={12}
                                    md={8}
                                    lg={8}
                                    xl={8}
                                    key={index}
                                    style={{ order: order, flex: '1 0 30%' }} // Use order property to control layout
                                    className="col"
                                >
                                    <Card
                                        title={
                                            <>
                                                <ReadOutlined /> {document.category}
                                            </>
                                        }
                                    >
                                        <ul>
                                            {document.titles.map((item: any, itemIndex: any) => (
                                                <li key={item._id}>
                                                    <div >
                                                        <Tooltip title="Tap to view">
                                                            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL}/document/${item._id}`} target='_blank' key={itemIndex}>
                                                                <FileTextOutlined /> {item.title}
                                                            </Link>
                                                        </Tooltip>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </Col>
                            );
                        })}
                </Row>

            </Card>
        </>
    )
}
