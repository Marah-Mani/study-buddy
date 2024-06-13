'use client'
import ParaText from '@/app/commonUl/ParaText';
import { Button, Col, Form, Input, message, Row, Select, Spin, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import AuthContext from '@/contexts/AuthContext';
import { RcFile } from 'antd/es/upload';
import imageCompression from 'browser-image-compression';
import { updateProfileDetails } from '@/lib/userApi';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Cookies from 'js-cookie';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';

interface Props {
    activeKey: string;
}

export default function Brands({ activeKey }: Props) {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(true)
    const { user, setUser } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [isEmailDisabled, setIsEmailDisabled] = useState(false);
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const token = Cookies.get('session_token');




    const handlePhoneChange = (value: any, countryData: any) => {
        setPhone(value);
        setCountry(countryData.name);
        form.setFieldsValue({ country: countryData.name });
    };

    useEffect(() => {
        if (user) {
            setLoading(false)
            form.setFieldsValue({
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                country: user?.address?.country,
                state: user?.address?.state,
            });
            setFileList([{
                uid: '-1',
                name: user.image,
                status: 'done',
                url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${user.image}`,
            }])

        }
    }, [user]);

    const onfinish = async (values: any) => {
        try {
            const formData = new FormData();
            if (fileList && fileList.length > 0) {
                if (fileList[0]?.originFileObj) {
                    const file = fileList[0]?.originFileObj as File;
                    formData.append('image', file);
                } else {
                    const file = fileList[0]?.name;
                    formData.append('image', file as string);
                }
            }

            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('phoneNumber', values.phoneNumber);
            formData.append('country', values.country);
            formData.append('state', values.state);
            formData.append('userId', user?._id || '');
            formData.append('skills', values.skills);
            formData.append('languages', values.languages);
            formData.append('profileTitle', values.profileTitle);
            formData.append('profileDescription', values.profileDescription);
            formData.append('instagram', values.instagram);
            formData.append('linkedIn', values.linkedIn);
            formData.append('facebook', values.facebook);
            formData.append('twitter', values.twitter);

            const res = await updateProfileDetails(formData);


            if (res.status) {
                setUser(res.brand);
                message.success(res.message);
            } else {
                message.error(res.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handleRemove = () => {
        setFileList([]);
    }

    const handleChange = async ({ fileList: newFileList }: { fileList: UploadFile[] }) => {

        const file = newFileList[newFileList.length - 1]?.originFileObj as File;
        try {
            if (file) {
                // Check if file size is less than or equal to 5 MB
                if (file.size / 1024 / 1024 <= 5) {
                    const options = {
                        maxSizeMB: 1, // Maximum size in MB
                        maxWidthOrHeight: 1024, // Maximum width or height
                        useWebWorker: true // Use web workers for faster compression
                    };

                    const compressedFile = await imageCompression(file, options);

                    // Create a compatible object with the necessary properties
                    const formattedFile: UploadFile<any> = {
                        uid: Date.now().toString(),
                        name: compressedFile.name,
                        status: 'done',
                        size: compressedFile.size,
                        type: compressedFile.type,
                        originFileObj: compressedFile as RcFile // Set the original file object with the proper type
                    };

                    // Set the new file list with the formatted compressed file
                    setFileList([formattedFile]);
                } else {
                    // Show a notification message to the user
                    message.error('Image size cannot exceed 5 MB!');
                    setFileList([]); // Clear the file list to prevent upload
                }
            }
        } catch (error) {
            console.error('Error compressing image:', error);
            // Handle the error without displaying any messages (optional)
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    return (
        <>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin style={{ marginTop: '-20vh' }} />
            </div>
                :
                <div>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        Profile Details
                    </ParaText>
                    <div className="smallTopMargin"></div>
                    <Form layout='vertical' form={form} size='large' onFinish={onfinish} >
                        <Row gutter={24}>

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
                                                    message: `Name must be at most ${validationRules.textLength.maxLength} characters`
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

                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                        <Form.Item name='phoneNumber' label='Phone Number'
                                            rules={
                                                [
                                                    {
                                                        required: true,
                                                        message: 'Please enter phone number'
                                                    },
                                                    { pattern: /^[0-9]+$/, message: 'Please enter a valid phone number' },
                                                ]
                                            }
                                        >
                                            {/* <NumericInput value={value} onChange={setValue} /> */}

                                            <PhoneInput
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
                                                    message: 'Please enter state'
                                                },
                                                {
                                                    max: validationRules.textLength.maxLength,
                                                    message: `Name must be at most ${validationRules.textLength.maxLength} characters`
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
                                                listType="picture-card"
                                                fileList={fileList}
                                                // onPreview={handlePreview}
                                                onChange={handleChange}
                                                // beforeUpload={handleBeforeUpload}
                                                onRemove={handleRemove}
                                                accept=".jpg,.jpeg,.png"
                                                headers={{ Authorization: `Bearer ${token}` }}
                                                name='file'
                                                action={`${process.env['NEXT_PUBLIC_API_URL']}/user/profile/update-profile-details`}
                                            >
                                                {fileList.length >= 1 ? null : uploadButton}
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Form.Item name={'profileTitle'} label={'Profile Title'}>
                                            <Input placeholder='Enter profile title' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name={'skills'} label={'Skills'}>
                                            <Select
                                                mode="tags"
                                                style={{ width: '100%' }}
                                                onChange={handleChange}
                                                tokenSeparators={[',']}
                                                placeholder="Enter skills"
                                            // options={options}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name={'languages'} label={'Languages'}>
                                            <Select
                                                mode="tags"
                                                style={{ width: '100%' }}
                                                onChange={handleChange}
                                                tokenSeparators={[',']}
                                                placeholder="Enter Languages"
                                            // options={options}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name={'profileDescription'} label={'Profile Description'}>
                                            <Input.TextArea placeholder='Enter profile description' autoSize={{ minRows: 5, maxRows: 6 }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                                <Row gutter={24}>
                                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                        <Form.Item
                                            name={'facebook'}
                                            label={'Facebook'}
                                            rules={[
                                                {
                                                    validator: (_, value) => {
                                                        if (!value || validationRules.facebookURL.pattern.test(value)) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject('Please enter a valid Facebook URL');
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder='Enter Facebook link'
                                                type='link'
                                                maxLength={50}
                                                suffix={<FaFacebook />}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                        <Form.Item
                                            name={'twitter'}
                                            label={'Twitter'}
                                            rules={[
                                                {
                                                    validator: (_, value) => {
                                                        if (!value || validationRules.twitterURL.pattern.test(value)) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject('Please enter a valid Twitter URL');
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder='Enter Twitter link'
                                                type='link'
                                                maxLength={50}
                                                suffix={<FaSquareXTwitter />}
                                            />
                                        </Form.Item>

                                    </Col>
                                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                        <Form.Item
                                            name={'linkedIn'}
                                            label={'LinkedIn'}
                                            rules={[
                                                {
                                                    validator: (_, value) => {
                                                        if (!value || validationRules.linkedinURL.pattern.test(value)) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject('Please enter a valid LinkedIn URL');
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder='Enter LinkedIn link'
                                                type='link'
                                                maxLength={50}
                                                suffix={<FaLinkedinIn />}
                                            />
                                        </Form.Item>

                                    </Col>
                                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                        <Form.Item
                                            name={'instagram'}
                                            label={'Instagram'}
                                            rules={[
                                                {
                                                    validator: (_, value) => {
                                                        if (!value || validationRules.instagramURL.pattern.test(value)) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject('Please enter a valid Instagram URL');
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder='Enter Instagram link'
                                                type='link'
                                                maxLength={50}
                                                suffix={<FaInstagram />}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col md={24} style={{ textAlign: 'end' }}>
                                        <div className="largeTopMargin"></div>
                                        <Button type='primary' htmlType='submit'>Submit</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </Form>
                </div>
            }
        </>
    )
}
