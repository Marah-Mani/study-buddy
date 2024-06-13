'use client';
import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { getUserDocuments, uploadDigitalSignature } from '@/lib/userApi';
import {
    Button,
    Card,
    Checkbox,
    CheckboxProps,
    Col,
    Form,
    Row,
    message,
    Image,
} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface Props {
    activeKey: string
}
export default function DigitalSignature({ activeKey }: Props) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [formLoading, setFormLoading] = useState(false);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);

    useEffect(() => {
        if (activeKey == '4') {
            if (user) fetchDocuments();
        }
    }, [activeKey, user])

    const fetchDocuments = async () => {
        try {
            const data = {
                userId: user?._id
            }
            const res = await getUserDocuments(data);
            if (res.status === true) {
                setSignatureImage(res.data?.digitalSignature || '');
            } else {
                setSignatureImage('');
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    let padRef = React.useRef<SignatureCanvas>(null);
    const clear = () => {
        padRef.current?.clear();
        setLoading(false);
        setFormLoading(false);
    };

    const handleSubmit = async (values: any) => {
        try {
            setFormLoading(true);
            const url = padRef.current?.getTrimmedCanvas().toDataURL('image/png');
            if (
                url ==
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC'
            ) {
                message.error('Please upload a signature');
                setFormLoading(false);
                return;
            }
            values.sign = url;
            values.userId = user?._id;
            const res = await uploadDigitalSignature(values);
            if (res.status) {
                message.success(res.message);
                setFormLoading(false);
                setLoading(false);
            }
        } catch (error) {
            setFormLoading(false);
            ErrorHandler.showNotification(error);
        }
    };

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                Digital Signature
            </ParaText>
            <div className="smallTopMargin"></div>
            <Row>
                <Col xxl={16} xl={16} lg={16} md={24} sm={24} xs={24}>
                    <Row gutter={10}>
                        <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                            <Card>
                                <Form
                                    layout="vertical"
                                    form={form}
                                    size="large"
                                    onFinish={handleSubmit}
                                >
                                    <Row gutter={20}>
                                        <Col lg={24} md={24} sm={24} xs={24}>
                                            {signatureImage ? (
                                                <>
                                                    <Image
                                                        src={signatureImage}
                                                        alt="my signature"
                                                        width={470}
                                                        height={290}
                                                        style={{
                                                            objectFit: 'fill'
                                                        }}
                                                        preview={false}
                                                    />
                                                    <div className="smallTopMargin"></div>
                                                    <div className="textEnd">
                                                        <Button type="primary" onClick={() => setSignatureImage(null)}>
                                                            Add new signature
                                                        </Button>
                                                    </div>
                                                </>
                                            ) :
                                                <>
                                                    <Form.Item name="signature">
                                                        <SignatureCanvas
                                                            ref={padRef}
                                                            penColor="#012a59"
                                                            canvasProps={{
                                                                width: 870,
                                                                height: 290,
                                                                style: { border: '1px solid #d9d9d9', borderRadius: '9px' }
                                                            }}
                                                        />
                                                    </Form.Item>
                                                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                                        <div
                                                            className="textEnd"
                                                            style={{ display: 'flex', gap: '30px', justifyContent: 'flex-end' }}
                                                        >
                                                            <Button type="link" onClick={clear}>
                                                                Reset signature
                                                            </Button>
                                                            <Button type="primary" htmlType="submit" loading={formLoading}>
                                                                {formLoading ? 'Please wait' : 'Submit signature'}
                                                            </Button>
                                                        </div>
                                                        <div className="smallTopMargin"></div>
                                                    </Col>
                                                </>
                                            }
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}
