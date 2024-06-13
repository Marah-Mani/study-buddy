import React, { useContext, useEffect, useState } from 'react'
import {
    Button,
    Cascader,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    message,
    Row,
    Select,
    TreeSelect,
} from 'antd';
import UploadImage from '../UploadImage';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { addUpdateProductDetails, getProductCategories } from '@/lib/adminApi';
import { validationRules } from '@/lib/validations';
import NumericInput from '@/app/commonUl/NumericInput';

const { RangePicker } = DatePicker;
export default function FormType() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = React.useState<any>([]);
    const [category, setCategory] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        if (user) {
            fetchCategories();
        }
    }, [user]);

    const fetchCategories = async () => {
        try {
            const res = await getProductCategories();
            if (res.status == true) {
                setCategory(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('price', values.price);
            formData.append('discountPrice', values.discountPrice);
            formData.append('categoryId', values.categoryId);
            formData.append('subCategoryId', values.subCategoryId);
            formData.append('status', values.status);
            formData.append('createdBy', user?._id || '');

            if (fileList.length > 0) {
                const fileListWithBlob = fileList as { originFileObj: Blob }[];
                // Append each file to the FormData object under a single key
                fileListWithBlob.forEach((file) => {
                    formData.append('images', file.originFileObj);
                });
            }

            const res = await addUpdateProductDetails(formData);
            if (res.status === true) {
                message.success(res.message);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    return (
        <div>
            <Form variant="filled" layout='vertical' onFinish={handleSubmit}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Title"
                            name="title"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter title'
                                },
                                {
                                    max: validationRules.textLength.maxLength,
                                    message: `Title must be at most ${validationRules.textLength.maxLength} characters`
                                }
                            ]}>
                            <Input showCount
                                maxLength={
                                    validationRules.textLength.maxLength
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            label="Category"
                            name="categoryId"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please select category'
                                }

                            ]}
                        >
                            <Select
                                placeholder={'Select a category'}
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                options={
                                    category.categories?.map((item: any) => {
                                        return {
                                            value: item._id,
                                            label: item.name
                                        }
                                    })
                                }
                                onChange={(value: string) => setSelectedCategory(value)}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            label="Sub-category"
                            name="subCategoryId"
                        >
                            <Select
                                placeholder={'Select a sub-category'}
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                options={
                                    selectedCategory ?
                                        category.subCategories
                                            ?.filter((item: any) => item.categoryId == selectedCategory)
                                            .map((item: any) => ({
                                                value: item._id,
                                                label: item.name
                                            })) : []
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Price" name="price">
                            <NumericInput placeholder={'Enter price'} value={''} onChange={() => { }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Discounted Price" name="discountPrice">
                            <NumericInput placeholder={'Enter discount price'} value={''} onChange={() => { }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                        >
                            <Select
                                placeholder={'Select a status'}
                                defaultValue={
                                    'active'
                                }
                                options={[
                                    {
                                        label: 'Active',
                                        value: 'active'
                                    },
                                    {
                                        label: 'Inactive',
                                        value: 'inactive'
                                    }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            label="Description"
                            name="Description"
                            rules={[
                                { required: true, message: 'Please Description!' },
                                {
                                    max: validationRules.textLongLength.maxLength,
                                    message: `Description must be at most ${validationRules.textLongLength.maxLength} characters`
                                }
                            ]}
                        >
                            <Input.TextArea
                                rows={3}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            label="File Upload"
                            name="images"
                        >
                            <UploadImage fileList={(data: any) => setFileList(data)} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className='textEnd'>
                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

