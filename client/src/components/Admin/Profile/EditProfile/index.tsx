'use client'
import ParaText from '@/app/commonUl/ParaText';
import { Button, Col, Form, Input, message, Row, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import NumericInput from '@/app/commonUl/NumericInput';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import AuthContext from '@/contexts/AuthContext';
import { updateProfileDetails } from '@/lib/adminApi';
import { RcFile } from 'antd/es/upload';
import imageCompression from 'browser-image-compression';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


interface Props {
    activeKey?: string;
}

export default function Brands({ activeKey }: Props) {
    const [profile, setProfile] = useState<UploadFile[]>([]);
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');

    const handlePhoneChange = (value: any, countryData: any) => {
        setPhone(value);
        setCountry(countryData.name);
        form.setFieldsValue({ country: countryData.name });
    };

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                country: user?.address?.country,
                state: user?.address?.state,
            });
            setProfile([{
                uid: '-1',
                name: user.image,
                status: 'done',
                url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${user.image}`,
            }])

        }
    }, [user]);



    const onfinish = async (values: any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            if (profile && profile.length > 0) {

                if (profile[0]?.originFileObj) {
                    const file = profile[0]?.originFileObj as File;
                    formData.append('image', file);
                } else {
                    const file = profile[0]?.name;
                    formData.append('image', file as string);
                }
            }
            formData.append('name', values.name);
            formData.append('email', 'admin@gmail.com');
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('country', values.country);
            formData.append('state', values.state);
            formData.append('userId', user?._id || '');

            const res = await updateProfileDetails(formData);
            if (res.status == true) {
                message.success(res.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }


    const handleChange = async ({ fileList: newFileList }: { fileList: UploadFile[] }) => {

        const file = newFileList[newFileList.length - 1]?.originFileObj as File;
        try {
            if (file) {
                // Check if file size is less than or equal to 5 MB
                if (file.size / 1024 / 1024 <= 7) {
                    const options = {
                        maxSizeMB: 1, // Maximum size in MB
                        maxWidthOrHeight: 1024, // Maximum width or height
                        useWebWorker: true // Use web workers for faster compression
                    };

                    const compressedFile = await imageCompression(file, options);

                    // Create a compatible object with the necessary properties
                    const formattedFile: UploadFile<any> = {
                        uid: Date.now().toString(), // Generate a unique UID
                        name: compressedFile.name, // Set the name of the file
                        status: 'done', // Set the status as 'done' since the file is ready for upload
                        size: compressedFile.size, // Set the size of the file
                        type: compressedFile.type, // Set the type of the file
                        originFileObj: compressedFile as RcFile // Set the original file object with the proper type
                    };

                    // Set the new file list with the formatted compressed file
                    setProfile([formattedFile]);
                } else {
                    // Show a notification message to the user
                    message.error('Image size cannot exceed 5 MB!');
                    setProfile([]); // Clear the file list to prevent upload
                }
            }
        } catch (error) {
            console.error('Error compressing image:', error);
            // Handle the error without displaying any messages (optional)
        }
    };

    const handleRemove = () => {
        setProfile([]);
    }
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="primaryColor">
                Profile Details
            </ParaText>
            <div className="smallTopMargin"></div>
            <Form layout='vertical' form={form} size='large' onFinish={onfinish} >
                <Row>
                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                        <Row gutter={10}>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item name={'name'} label={'Name'}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please enter name'
                                        },
                                        {
                                            max: validationRules.textLength.maxLength,
                                            message: `Please Enter Name`,
                                            validator: (_, value) => {
                                                if (!value || !value.trim()) {
                                                    return Promise.reject(new Error('Name cannot be empty '));
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                        { pattern: /^[A-Za-z\s]+$/, message: 'Please enter only alphabets!' }
                                    ]}
                                >
                                    <Input
                                        placeholder='Enter name'
                                        type='text' maxLength={30}

                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item name={'email'} label='Email'
                                    rules={[{
                                        required: true,
                                        message: 'Please enter email',
                                        type: 'email'
                                    }]}
                                >
                                    <Input
                                        placeholder='Enter email'
                                        type='email' maxLength={50} disabled
                                        defaultValue={'admin@gmail.com'}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item name={'phoneNumber'} label='Phone Number'
                                    rules={
                                        [
                                            {
                                                required: true,
                                                message: 'Please enter phone number'
                                            },
                                        ]
                                    }
                                >
                                    <PhoneInput
                                        inputStyle={{ width: '100%' }}
                                        country={'us'}
                                        value={phone}
                                        onChange={handlePhoneChange}
                                    />

                                </Form.Item>



                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item name={'country'} label='Country'
                                    rules={
                                        [
                                            {
                                                required: true,
                                                message: 'Please enter country'
                                            },
                                        ]
                                    }

                                >
                                    <Input
                                        placeholder='Enter country'
                                        type='text' maxLength={30}
                                        value={country}
                                        readOnly
                                    />
                                </Form.Item>
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item name={'state'} label='State'
                                    rules={[
                                        {
                                            required: true,
                                            message: ''
                                        },
                                        {
                                            max: validationRules.textLength.maxLength,
                                            message: `Please Enter State`,
                                            validator: (_, value) => {
                                                if (!value || !value.trim()) {
                                                    return Promise.reject(new Error('state cannot be empty '));
                                                }
                                                return Promise.resolve();
                                            },
                                        },
                                        { pattern: /^[A-Za-z\s]+$/, message: 'Please enter only alphabets!' }
                                    ]}
                                >
                                    <Input
                                        placeholder='Enter state'
                                        type='text' maxLength={50}
                                    />
                                </Form.Item>
                            </Col>
                            <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                                <Form.Item name={'image'} label='Profile Image'>
                                    <Upload
                                        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                        listType="picture-card"
                                        fileList={profile}
                                        onChange={handleChange}
                                        onRemove={handleRemove}
                                        // beforeUpload={handleBeforeUpload}
                                        accept=".jpg,.jpeg,.png"
                                    >
                                        {profile.length >= 1 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col md={12} style={{ textAlign: 'end' }}>
                                <div className="largeTopMargin"></div>
                                <div style={{ paddingTop: '50px' }}>
                                    <Button type='primary' htmlType='submit' style={{ borderRadius: '30px' }}>Submit</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Form>
        </>
    )
}
