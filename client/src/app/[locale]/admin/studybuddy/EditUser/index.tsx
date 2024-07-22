'use client'
import { Button, Col, Form, Input, message, Row, Select, Tooltip, Upload, UploadFile } from 'antd';
import React, { useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import { updateProfileDetails } from '@/lib/userApi';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import { handleFileCompression } from '@/lib/commonServices';
import { updateUserDetails } from '@/lib/adminApi';
import {
    GetLanguages, //async functions
} from "react-country-state-city";

interface Props {
    editData: any
    onReload: any
}
export default function EditUser({ editData, onReload }: Props) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [phone, setPhone] = useState('');
    const [languageList, setLanguageList] = useState<any[]>([]);

    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                name: editData.name,
                email: editData.email,
                phoneNumber: editData.phoneNumber,
                country: editData?.address?.country,
                state: editData?.address?.state,
                profileTitle: editData.profileTitle,
                profileDescription: editData.profileDescription,
                skills: editData.skills,
                languages: editData.languages,
                instagram: editData.socialLinks?.instagram,
                linkedIn: editData.socialLinks?.linkedin,
                facebook: editData.socialLinks?.facebook,
                twitter: editData.socialLinks?.twitter,
                higherEducation: editData.higherEducation,
            });
            setFileList([{
                uid: '-1',
                name: editData.image,
                status: 'done',
                url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${editData.image}`,
            }])

        }
    }, [editData]);

    useEffect(() => {
        GetLanguages().then((result: any) => {
            setLanguageList(result);
        });
    }, [])

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
            formData.append('userId', editData._id);
            formData.append('skills', values.skills);
            formData.append('languages', values.languages);
            formData.append('profileTitle', values.profileTitle);
            formData.append('higherEducation', values.higherEducation);
            formData.append('profileDescription', values.profileDescription);
            formData.append('instagram', values.instagram);
            formData.append('linkedIn', values.linkedIn);
            formData.append('facebook', values.facebook);
            formData.append('twitter', values.twitter);

            const res = await updateUserDetails(formData);
            if (res.status == true) {
                message.success(res.message);
                form.resetFields();
                setFileList([]);
                onReload();
            } else {
                message.error(res.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handlePhoneChange = (value: any, countryData: any) => {
        setPhone(value);
        form.setFieldsValue({ country: countryData.name });
    };

    const handleBeforeUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, "");
            setFileList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemove = () => {
        setFileList([]);
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Form layout='vertical' form={form} size='large' onFinish={onfinish} >
                <Row gutter={24}>
                    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
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
                                    <PhoneInput
                                        country={'il'}
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        inputStyle={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name={'profileDescription'} label={'Profile Description'}>
                                    <Input.TextArea placeholder='Enter profile description' autoSize={{ minRows: 1, maxRows: 6 }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={24} xs={24}>
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item name={'profileTitle'} label={'Profile Title'}>
                                    <Input placeholder='Enter profile title' />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name={'skills'} label={'Skills'}>
                                    <Input
                                        placeholder='Enter skills separated by comma'
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name={'languages'} label={'Languages'}>
                                    <Select
                                        mode='multiple'
                                        maxTagCount="responsive"
                                        maxTagPlaceholder={(omittedValues) => (
                                            <Tooltip title={omittedValues.map(({ label }) => label).join(', ')}>
                                                <span>...</span>
                                            </Tooltip>
                                        )}

                                        style={{ width: '100%' }}
                                    >
                                        {languageList.map((item, index) => (
                                            <option key={index} value={item.code}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    name='higherEducation'
                                    label='Higher Education'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select your highest education level'
                                        }
                                    ]}
                                >
                                    <Select placeholder='Select your highest education level'>
                                        <Select.Option value='none'>None</Select.Option>
                                        <Select.Option value='high school'>High School</Select.Option>
                                        <Select.Option value='associate degree'>Associate Degree</Select.Option>
                                        <Select.Option value='bachelor degree'>Bachelor Degree</Select.Option>
                                        <Select.Option value='master degree'>Master Degree</Select.Option>
                                        <Select.Option value='doctorate'>Doctorate</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Row gutter={24}>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
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
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
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
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
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
                            <Col xl={12} lg={12} md={12} sm={12} xs={12}>
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
                            <Col lg={12} xl={12} md={12} sm={12} xs={12}>
                                <Form.Item name={'image'} label='Profile Image'>
                                    fdfff
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        beforeUpload={handleBeforeUpload}
                                        onRemove={handleRemove}
                                        accept=".jpg,.jpeg,.png"
                                        name='file'
                                        action={`${process.env['NEXT_PUBLIC_API_URL']}/user/profile/update-profile-details`}
                                    >
                                        {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                </Form.Item>
                            </Col>
                            <Col md={12} className='textEnd'>
                                <div style={{ paddingTop: '30%' }}>
                                    <Button type='primary' htmlType='submit'>Update Profile</Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Form>
        </>
    )
}
