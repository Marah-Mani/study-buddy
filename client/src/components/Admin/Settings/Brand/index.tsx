'use client'
import ParaText from '@/app/commonUl/ParaText';
import { handleFileCompression } from '@/lib/commonServices';
import { Button, Col, Form, Input, message, Row, Switch, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import { deleteBrandLogo, getSingleBrandDetails, updateBrandDetails } from '@/lib/adminApi';
import { validationRules } from '@/lib/validations';
import AuthContext from '@/contexts/AuthContext';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


interface Props {
    activeKey: string
}

export default function Brands({ activeKey }: Props) {
    const [logoList, setLogoList] = useState<UploadFile[]>([]);
    const [favIconList, setFavIconList] = useState<UploadFile[]>([]);
    const [watermark, setWatermark] = useState<UploadFile[]>([]);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [brandId, setBrandId] = useState('')
    const [toggleEnabled, setToggleEnabled] = useState<boolean>(false);

    useEffect(() => {
        if (activeKey == '1') {
            if (user) fetchBrandDetail(user?._id || '');
        }
    }, [activeKey, user?._id])

    const fetchBrandDetail = async (id: string) => {
        try {
            const data = {
                userId: id
            }
            const res = await getSingleBrandDetails(data);
            console.log(res.data, 'GGGG')
            if (res.status == true) {
                // setLogoList(res.data.logo ? [res.data.logo] : []);
                // setFavIconList(res.data.favIcon ? [res.data.favIcon] : []);
                setBrandId(res.data._id);
                form.setFieldsValue({
                    brandName: res.data.brandName,
                    tagLine: res.data.tagLine,
                    email: res.data.email,
                    emailPassword: res.data.emailPassword,
                    phone: res.data.phone,
                    address: res.data.address,
                    googleMap: res.data.googleMap,
                    whatsApp: res.data.whatsApp,
                    website: res.data.website,
                })
                setToggleEnabled(res.data.toggleEnabled)
                setWatermark([{
                    uid: '1',
                    name: res.data.waterMarkIcon,
                    status: 'done',
                    url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/brandImage/original/${res.data.waterMarkIcon}`,
                }]);
                setFavIconList([{
                    uid: '2',
                    name: res.data.favIcon,
                    status: 'done',
                    url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/brandImage/original/${res.data.favIcon}`,
                }]);
                setLogoList([{
                    uid: '3',
                    name: res.data.logo,
                    status: 'done',
                    url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/brandImage/original/${res.data.logo}`,
                }]);
                console.log(`${process.env.NEXT_PUBLIC_IMAGE_URL}/brandImage/original/${res.data.logo}`, 'res.data.logo')
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const onfinish = async (values: any) => {
        console.log(favIconList[0]?.originFileObj as Blob)
        try {
            setLoading(true);
            const formData = new FormData();
            if (logoList.length > 0) {
                const fileLogo = logoList[0]?.originFileObj as Blob;
                formData.append('logo', fileLogo);
            }
            // Append favicon file if available
            if (favIconList.length > 0) {
                const fileFavIcon = favIconList[0]?.originFileObj as Blob;
                formData.append('favIcon', fileFavIcon);
            }
            // Append watermark file if available
            if (watermark.length > 0) {
                const fileWatermark = watermark[0]?.originFileObj as Blob;
                formData.append('waterMarkIcon', fileWatermark);
            }
            formData.append('brandName', values.brandName);
            formData.append('tagLine', values.tagLine);
            formData.append('email', values.email);
            formData.append('emailPassword', values.emailPassword);
            formData.append('phone', values.phone);
            formData.append('address', values.address);
            formData.append('googleMap', values.googleMap);
            formData.append('whatsApp', values.whatsApp);
            formData.append('website', values.website);
            formData.append('userId', user?._id || '');
            formData.append('toggleEnabled', toggleEnabled ? 'true' : 'false');;
            const res = await updateBrandDetails(formData);
            if (res.status == true) {
                message.success(res.message);
                setLoading(false);
                // setFavIconList([])
                // setWatermark([])
                // setLogoList([])

            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleLogoUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setLogoList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleIconUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setFavIconList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleWatermarkUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setWatermark(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    }

    const handleRemoveWatermark = async () => {
        setWatermark([])
    }
    const handleRemoveFavIcon = async () => {
        setFavIconList([])
    }

    const handleRemoveLogo = async () => {
        setLogoList([])

        // try {
        //     const data = {
        //         userId: user?._id,
        //         logo: null,
        //         brandId: brandId
        //     }
        //     const res = await deleteBrandLogo(data);
        //     if (res.status == true) {
        //         message.success(res.message);
        //         fetchBrandDetail(user?._id || '');
        //     }
        // } catch (error) {
        //     ErrorHandler.showNotification(error);
        // }
    }
    const onChange = (checked: boolean) => {
        setToggleEnabled(checked);
        console.log(`switch to ${checked}`);
    };

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="primaryColor">
                Brand Details
            </ParaText>
            <div className="smallTopMargin"></div>
            <Form layout='vertical' size='large' form={form} onFinish={onfinish} >
                <Row gutter={10}>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={'brandName'}
                            label={'Brand Name'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter brand name'
                                },
                                {
                                    max: validationRules.textLength.maxLength,
                                    message: `Brand name must be at most ${validationRules.textLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter brand name'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'tagLine'} label='Tag Line'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter tag line'
                                },
                                {
                                    max: validationRules.textLength.maxLength,
                                    message: `Tag line must be at most ${validationRules.textLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter tag line'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'email'} label='Email Address'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter email',
                                    type: 'email'
                                },
                                {
                                    min: validationRules.email.minLength,
                                    max: validationRules.email.maxLength,
                                    pattern: validationRules.email.pattern,
                                    message: `Email must be at most ${validationRules.textLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter email'
                                type='email' maxLength={50}
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'emailPassword'} label='Email Password' rules={[
                            {
                                required: true, message: 'Please  enter a password!'
                            },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+={}\[\]:;'"<>,.?/\\]).{8,10}$/,
                                message: 'Password must be between 8 and 10 characters long and include uppercase, lowercase, number, and special character.'
                            }
                        ]}>
                            <Input.Password
                                type='password'
                                placeholder="Password"
                                maxLength={10} />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'phone'} label='Phone Number'
                            rules={
                                [
                                    {
                                        required: true,
                                        message: 'Please enter phone number'
                                    },
                                    {
                                        pattern: validationRules.phoneNumber.pattern,
                                        message: 'Please enter a valid phone number'
                                    }
                                ]
                            }
                        >
                            <PhoneInput
                                country={'us'}
                                // value={this.state.phone}
                                onChange={value => { phone_number: value }}

                            />
                        </Form.Item>

                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'address'} label='Address' rules={[
                            {
                                required: true,
                                message: 'Please enter address'
                            },
                            {
                                max: validationRules.textLongLength.maxLength,
                                message: `Address must be at most ${validationRules.textLongLength.maxLength} characters`
                            }
                        ]}>
                            <Input
                                placeholder='Enter address'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'googleMap'} label='Google Map Address'
                            rules={[
                                {
                                    max: validationRules.textLongLength.maxLength,
                                    message: `Google map address must be at most ${validationRules.textLongLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter google map address'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                        <Form.Item
                            name={'whatsApp'}
                            label='WhatsApp Number'
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter WhatsApp number',
                                },
                            ]}
                        >
                            <PhoneInput
                                country={'us'}
                                // value={this.state.phone}
                                onChange={value => { phone_number: value }}

                            />
                        </Form.Item>
                    </Col>
                    <Col lg={8} xl={8} md={8} sm={24} xs={24}>
                        <Form.Item name={'website'} label='Website'
                            rules={[
                                {
                                    pattern: validationRules.websiteURL.pattern,
                                    message: 'Please enter a valid website url'
                                }
                            ]}
                        >
                            <Input
                                placeholder='Enter website'
                                type='text'
                            />
                        </Form.Item>
                    </Col>
                    <Col lg={3} xl={3} md={3} sm={24} xs={24}>
                        <Form.Item name={'logo'} label='Brand Logo'
                        // rules={[{
                        //     required: true,
                        //     message: 'Please upload brand logo'
                        // }]}
                        >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-330c5e6a2138"
                                listType="picture-card"
                                fileList={logoList}
                                beforeUpload={handleLogoUpload}
                                accept=".jpg,.jpeg,.png"
                                style={{ width: '100%' }}
                                onRemove={handleRemoveLogo}
                            >
                                {logoList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xl={3} lg={3} md={3} sm={24} xs={24}>
                        <Form.Item name={'favIcon'} label='Brand Favicon'
                        // rules={[{
                        //     required: true,
                        //     message: 'Please upload brand favicon'
                        // }]}
                        >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={favIconList}
                                beforeUpload={handleIconUpload}
                                onRemove={handleRemoveFavIcon}
                                accept=".jpg,.jpeg,.png"
                                style={{ width: '100%' }}
                            >
                                {favIconList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    {/* here waterMark */}
                    <Col lg={3} xl={3} md={3} sm={24} xs={24}>
                        <Form.Item name={'watermark'} label='Watermark' >
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-330c5e6a2138"
                                listType="picture-card"
                                fileList={watermark}
                                beforeUpload={handleWatermarkUpload}
                                accept=".jpg,.jpeg,.png"
                                style={{ width: '100%' }}
                                onRemove={handleRemoveWatermark}
                            >
                                {watermark.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col lg={3} xl={3} md={3} sm={24} xs={24}>
                        <div>
                            <Switch onChange={onChange} value={toggleEnabled} />
                        </div>
                    </Col>
                    <Col md={24} style={{ textAlign: 'end' }}>
                        <div className="smallTopMargin"></div>
                        <Button type='primary' loading={loading} htmlType='submit'>{loading ? 'Submitting' : 'Save Brand Details'}</Button>
                    </Col>
                </Row>
            </Form>

        </>
    )
}
