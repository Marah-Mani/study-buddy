
import ParaText from '@/app/commonUl/ParaText';
import PaymentCard from '@/app/commonUl/PaymentCard';
const { Title } = Typography;
import dayjs from 'dayjs';
import { Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, message, Row, Typography } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import 'react-credit-cards/lib/styles.scss';
import AuthContext from '@/contexts/AuthContext';
import { deleteCard, getAllCards, storeCardDetail } from '@/lib/commonApi';
import Image from 'next/image';
import { FaTrash } from 'react-icons/fa';

interface Props {
    activeKey: string;
}

export default function CardInfo({ activeKey }: Props) {
    const [form] = Form.useForm();
    const [formLoading, setFormLoading] = useState(false);
    const [showAddCardForm, setShowAddCardForm] = useState(true);
    const [cards, setCards] = useState<any>([]);
    const { user } = useContext(AuthContext);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.stripeCustomerId) {
            getAllCards({
                customerId: user?.stripeCustomerId
            }).then((res) => {
                setCards(res.data);
            });
        }
    }, [user?.stripeCustomerId, reload]);

    const [cardInfo, setCardInfo]: any = useState({
        cvc: '',
        expiry: '11/25',
        focus: 'name',
        name: '',
        number: ''
    });

    const onFinish = async (values: any) => {
        setFormLoading(true);
        values.userId = user?._id;
        values.email = user?.email;
        storeCardDetail(values)
            .then((res) => {
                if (res.success == true) {
                    setReload(!reload);
                    setShowAddCardForm(false);
                    message.success('Card saved.');
                }
            })
            .finally(() => {
                setFormLoading(false);
            });
    };

    const handleDeleteCard = (cardId: string, customer: string) => {
        setLoading(true);
        deleteCard({
            cardId: cardId,
            customerId: customer
        }).then((res: any) => {
            if (res.success) {
                setReload(!reload);
            } else {
                message.error(res.message);
            }
        });
        setLoading(false);
    };

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="primaryColor">
                Card Information
            </ParaText>
            <div className="smallTopMargin"></div>
            <Row gutter={[16, 16]}>
                <Col xl={6} lg={6} md={6}>
                    {cards.map((card: any, index: any) => (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', backgroundColor: '#cccc' }}>
                                <p>Payment cards</p>
                                <p style={{ textAlign: 'start', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <Image width={30} height={30} src={`/cards/${card?.brand}.svg`} alt={card?.brand} />{' '}
                                    <span>••••{card?.last4}</span>
                                </p>
                                <p>{card?.expMonth + '/' + card?.expYear}</p>
                                <Button type="link" onClick={() => handleDeleteCard(card?.id, card?.customer)}>
                                    <FaTrash />
                                </Button>
                            </div>
                            <Col xs={24} sm={20} md={24} lg={24} xl={24}>
                                <Divider />
                            </Col>
                        </>
                    ))}
                </Col>
                <Col lg={12} xl={12} md={12}>
                    {showAddCardForm && (
                        <Card
                            title={
                                <>
                                    <ParaText size="large" fontWeightBold={600} color="primaryColor">
                                        Add New Card
                                    </ParaText>
                                </>
                            }
                        >
                            <Row gutter={20}>
                                <Col xs={24} sm={20} md={13} lg={13} xl={13} xxl={13}>
                                    <div className="smallTopMargin"></div>
                                    <Form
                                        name="card_details"
                                        onFinish={onFinish}
                                        initialValues={{ remember: true }}
                                        layout="vertical"
                                        size="large"
                                    >
                                        <Row gutter={20}>
                                            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                                                <Form.Item
                                                    name="cardholderName"
                                                    label=""
                                                    rules={[
                                                        {
                                                            required: true,
                                                            pattern: /^[a-zA-Z\s]+$/,
                                                            message: 'Please input only letters for Cardholder Name!'
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        maxLength={30}
                                                        placeholder="CARD HOLDER NAME"
                                                        onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                                                        onFocus={() => setCardInfo({ ...cardInfo, focus: 'name' })}
                                                    />
                                                </Form.Item>
                                                <div className="smallTopMargin"></div>
                                            </Col>
                                            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                                                <Form.Item
                                                    name="cardNumber"
                                                    label=""
                                                    rules={[{ required: true, message: 'Please input your card number!' }]}
                                                >
                                                    <InputNumber
                                                        placeholder="XXXX-XXXX-XXXX-XXXX"
                                                        style={{ width: '100%' }}
                                                        maxLength={16}
                                                        onChange={(value) =>
                                                            setCardInfo({ ...cardInfo, number: Number(value) })
                                                        }
                                                        onFocus={(value) => setCardInfo({ ...cardInfo, focus: 'number' })}
                                                    />
                                                </Form.Item>
                                                <div className="smallTopMargin"></div>
                                            </Col>
                                            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                                <Form.Item
                                                    name="expiryDate"
                                                    label=""
                                                    rules={[{ required: true, message: 'Please input expiry date!' }]}
                                                >
                                                    <DatePicker
                                                        placeholder="MM/YY"
                                                        style={{ width: '100%', height: '40px' }}
                                                        picker="month"
                                                        format="MM/YY"
                                                        disabledDate={(current) =>
                                                            current && current.isBefore(dayjs().startOf('day'))
                                                        }
                                                        autoComplete="off"
                                                        onChange={(value: any, dateString: string) => {
                                                            console.log(dateString);
                                                            setCardInfo({ ...cardInfo, expiry: dateString });
                                                        }}
                                                        onFocus={() => setCardInfo({ ...cardInfo, focus: 'expiry' })}
                                                    />
                                                </Form.Item>
                                                <div className="smallTopMargin"></div>
                                            </Col>
                                            <Col lg={12} xl={12} md={12} sm={24} xs={24}>
                                                <Form.Item
                                                    name="cvc"
                                                    label=""
                                                    rules={[{ required: true, message: 'Please input CVC!' }]}
                                                >
                                                    <InputNumber
                                                        placeholder="CVC"
                                                        style={{ width: '100%' }}
                                                        maxLength={3}
                                                        onChange={(value) =>
                                                            setCardInfo({ ...cardInfo, cvc: Number(value) })
                                                        }
                                                        onFocus={(value) => setCardInfo({ ...cardInfo, focus: 'cvc' })}
                                                    />
                                                </Form.Item>
                                                <div className="smallTopMargin"></div>
                                            </Col>
                                            <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                                                <div className="textEnd">
                                                    <Button
                                                        style={{ width: '100%' }}
                                                        type="primary"
                                                        htmlType="submit"
                                                        loading={formLoading}
                                                    >
                                                        Save Card
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col xs={24} sm={20} md={10} lg={10} xl={10} xxl={10}>
                                    <div className="smallTopMargin"></div>
                                    <Cards
                                        cvc={cardInfo.cvc || ''}
                                        expiry={cardInfo.expiry || ''}
                                        focused={cardInfo.focus || ''}
                                        name={cardInfo.name || ''}
                                        number={cardInfo.number || ''}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    )}
                </Col>
            </Row>
        </>
    )
}
