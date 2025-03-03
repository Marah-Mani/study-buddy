'use client'
import { Button, Col, Form, Input, message, Row, Select, Spin, Tooltip, Upload, UploadFile } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import AuthContext from '@/contexts/AuthContext';
import { updateUserProfileDetails } from '@/lib/userApi';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Cookies from 'js-cookie';
import { FaFacebook, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { handleFileCompression } from '@/lib/commonServices';
import {
    GetLanguages, //async functions
} from "react-country-state-city";
import { updateProfileDetails } from '@/lib/adminApi';
import './style.css';
import { getDepartments } from '@/lib/ApiAdapter';

export default function Brands() {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false)
    const { user, setUser } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [phone, setPhone] = useState('');
    const token = Cookies.get('session_token');
    const [languageList, setLanguageList] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<any | null>(null);

    const handlePhoneChange = (value: any, countryData: any) => {
        setPhone(value);
        form.setFieldsValue({ country: countryData.name });
    };

    useEffect(() => {
        if (user) {
            setSelectedDepartment(user.departmentId);
            const subjectsArray = user?.subjects?.length ? user.subjects[0].split(',') : [];
            form.setFieldsValue({
                name: user.name ?? '',
                email: user.email ?? '',
                phoneNumber: user.phoneNumber ?? '',
                country: user?.address?.country ?? '',
                state: user?.address?.state ?? '',
                profileTitle: user.profileTitle ?? '',
                profileDescription: user.profileDescription ?? '',
                skills: user.skills ?? '',
                languages: user.languages ?? '',
                instagram: user.socialLinks?.instagram ?? '',
                linkedIn: user.socialLinks?.linkedin ?? '',
                facebook: user.socialLinks?.facebook ?? '',
                twitter: user.socialLinks?.twitter ?? '',
                higherEducation: user.higherEducation ?? '',
                interest: user.interestedIn ?? '',
                gender: user.gender ?? '',
                departments: user.departmentId ?? '',
                subjects: subjectsArray,
            });
            if (user.image) {
                setFileList([{
                    uid: '-1',
                    name: user.image,
                    status: 'done',
                    url: `${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${user.image}`
                    ,
                }])
            }

        }
    }, [user]);

    useEffect(() => {
        GetLanguages().then((result: any) => {
            setLanguageList(result);
        });
        getDepartments().then((res) => {
            if (res.status === true) {
                setDepartments(res.data);
            }
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
            formData.append('userId', user?._id || '');
            formData.append('skills', values.skills);
            formData.append('languages', values.languages);
            formData.append('profileTitle', values.profileTitle);
            formData.append('higherEducation', values.higherEducation);
            formData.append('profileDescription', values.profileDescription);
            formData.append('interestedIn', values.interest);
            formData.append('gender', values.gender);
            formData.append('departments', values.departments);
            formData.append('subjects', values.subjects);
            if (values.facebook) {
                formData.append('facebook', values.facebook);
            }
            if (values.twitter) {
                formData.append('twitter', values.twitter);
            }
            if (values.linkedIn) {
                formData.append('linkedIn', values.linkedIn);
            }
            if (values.instagram) {
                formData.append('instagram', values.instagram);
            }
            let res;
            if (user?.role == 'admin') {
                res = await updateProfileDetails(formData);
            } else {
                res = await updateUserProfileDetails(formData);
            }


            if (res.status == true) {
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

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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

    const handleDepartmentChange = (value: string) => {
        setSelectedDepartment(value);
        form.setFieldsValue({ subjects: [] }); // Reset subjects field in the form
    };

    const getSubjectsForDepartment = (departmentName: string): string[] => {
        const selectedDept = departments.find((dept: any) => dept._id === departmentName); // Assuming _id is used as the unique identifier
        return selectedDept ? selectedDept.subjects : [];
    };

    return (
        <>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin style={{ marginTop: '-20vh' }} />
            </div>
                :
                <div className='mainSection editProfileForm'>
                    <div className="smallTopMargin"></div>
                    <Form layout='vertical' form={form} size='large' onFinish={onfinish} className='ant-items-mar'>
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
                                                style={{ height: '35px' }}
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
                                                style={{ height: '35px' }}
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
                                                inputStyle={{ width: '100%', height: '35px' }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={24} xl={24} md={24} sm={24} xs={24}>
                                        <Form.Item name={'gender'} label='Gender'
                                            rules={
                                                [
                                                    {
                                                        required: true,
                                                        message: 'Please select gender'
                                                    },
                                                ]
                                            }
                                        >
                                            <Select
                                                style={{ width: '100%', height: '35px' }}
                                                placeholder="Select gender"
                                            >
                                                <Select.Option value="male">Male</Select.Option>
                                                <Select.Option value="female">Female</Select.Option>
                                                <Select.Option value="other">Other</Select.Option>
                                            </Select>
                                        </Form.Item>

                                    </Col>
                                    <Col lg={12} xl={12} md={12} sm={0} xs={0}>
                                        <Form.Item name={'image'} label='Profile Image'>
                                            <Upload
                                                listType="picture-card"
                                                fileList={fileList}
                                                beforeUpload={handleBeforeUpload}
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
                            {user?.role !== 'admin' &&
                                <>
                                    <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                                        <Row gutter={24}>
                                            <Col span={24}>
                                                <Form.Item name={'profileTitle'} label={'Profile Title'}>
                                                    <Input placeholder='Enter profile title' style={{ height: '35px' }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={24}>
                                                <Form.Item name={'skills'} label={'Skills'}>
                                                    <Input
                                                        placeholder='Enter skills separated by comma'
                                                    />
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
                                                    <Select placeholder='Select your highest education level' style={{ height: '35px' }}>
                                                        <Select.Option value='none'>None</Select.Option>
                                                        <Select.Option value='high school'>High School</Select.Option>
                                                        <Select.Option value='associate degree'>Associate Degree</Select.Option>
                                                        <Select.Option value='bachelor degree'>Bachelor Degree</Select.Option>
                                                        <Select.Option value='master degree'>Master Degree</Select.Option>
                                                        <Select.Option value='doctorate'>Doctorate</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                                <Form.Item
                                                    label='Interest'
                                                    name="interest"
                                                    rules={[{ required: true, message: 'Please select your interest!' }]}
                                                >
                                                    <Select placeholder="Select interest" style={{ height: '35px', borderRadius: '30px' }}>
                                                        <Select.Option value="tutor">Tutor</Select.Option>
                                                        <Select.Option value="student">Student</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                                <Form.Item
                                                    label='Department'
                                                    name="departments"
                                                    rules={[{ required: true, message: 'Please select departments!' }]}
                                                >
                                                    <Select
                                                        placeholder="Select departments"
                                                        onChange={handleDepartmentChange}
                                                        style={{ height: '35px', borderRadius: '30px' }}
                                                    >
                                                        {departments &&
                                                            departments.map((department: any) => (
                                                                <Select.Option key={department._id} value={department._id}>
                                                                    {department.departmentName}
                                                                </Select.Option>
                                                            ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                                <Form.Item label='Subjects' name="subjects" rules={[{ required: true, message: 'Please select subjects!' }]}>
                                                    <Select
                                                        mode="multiple"
                                                        placeholder="Select subjects"
                                                        maxTagCount="responsive"
                                                        disabled={!selectedDepartment}
                                                        style={{ height: '35px', borderRadius: '30px' }}
                                                    >
                                                        {selectedDepartment &&
                                                            getSubjectsForDepartment(selectedDepartment).map(
                                                                (subject: string, index: number) => (
                                                                    <Select.Option key={index} value={subject}>
                                                                        {subject}
                                                                    </Select.Option>
                                                                )
                                                            )}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </>
                            }
                            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
                                <Row gutter={24}>
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
                                                style={{ width: '100%', height: '35px' }}
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
                                                style={{ height: '35px' }}
                                                type='link'
                                                maxLength={50}
                                                suffix={<FaFacebook />}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                                        <Form.Item
                                            name={'twitter'}
                                            label={'X'}
                                            rules={[
                                                {
                                                    validator: (_, value) => {
                                                        if (!value || validationRules.twitterURL.pattern.test(value)) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject('Please enter a valid X URL');
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                style={{ height: '35px' }}
                                                placeholder='Enter X link'
                                                type='link'
                                                maxLength={50}
                                                suffix={<FaXTwitter />}
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
                                                style={{ height: '35px' }}
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
                                                style={{ height: '35px' }}
                                                placeholder='Enter Instagram link'
                                                type='link'
                                                maxLength={50}
                                                suffix={<FaInstagram />}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name={'profileDescription'} label={'Profile Description'}
                                            rules={[
                                                {
                                                    max: 200, // Maximum 200 characters
                                                    message: 'Profile description must be less than 200 characters',
                                                },
                                            ]}>
                                            <Input.TextArea placeholder='Enter profile description' autoSize={{ minRows: 1, maxRows: 6 }} />
                                        </Form.Item>
                                    </Col>
                                    <Col lg={0} xl={0} md={0} sm={12} xs={12}>
                                        <Form.Item name={'image'} label='Profile Image'>
                                            <Upload
                                                listType="picture-card"
                                                fileList={fileList}
                                                beforeUpload={handleBeforeUpload}
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
                        </Row>
                        <Col md={24} className='textEnd'>
                            <Button type='primary' htmlType='submit' style={{ borderRadius: '30px' }}>Update Profile</Button>
                        </Col>
                    </Form>
                </div>
            }

        </>
    )
}
