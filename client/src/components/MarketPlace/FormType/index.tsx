import React, { useContext, useEffect, useState } from 'react'
import {
    Button,
    Cascader,
    Col,
    DatePicker,
    Form,
    Image,
    Input,
    InputNumber,
    Mentions,
    message,
    Popconfirm,
    Row,
    Select,
    TreeSelect,
} from 'antd';
import UploadImage from '../UploadImage';
import AuthContext from '@/contexts/AuthContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { validationRules } from '@/lib/validations';
import NumericInput from '@/app/commonUl/NumericInput';
import { getProductCategories, addUpdateProductDetails, deleteProductImage } from '@/lib/commonApi';

interface Props {
    onSuccess: any;
    editData: any;
}

export default function FormType({ onSuccess, editData }: Props) {
    const { user } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = React.useState<any>([]);
    const [category, setCategory] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [productId, setProductId] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');

    const handlePriceChange = (value: string) => {
        setPrice(value);
    };

    const handleDiscountPriceChange = (value: string) => {
        setDiscountPrice(value);
    };

    useEffect(() => {
        if (user) {
            fetchCategories();
        }
        if (editData) {
            setLoading(true);
            form.setFieldsValue({
                title: editData.title,
                description: editData.description,
                price: editData.price,
                discountPrice: editData.discountPrice,
                categoryId: editData.categoryId,
                subCategoryId: editData.subCategoryId,
                status: editData.status,
            })
            setSelectedCategory(editData.categoryId);
            setProductId(editData._id);
            setFileList(editData.images ? [{
                uid: '1',
                name: editData.images,
                status: 'done',
                url: `${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/medium/${editData.images}`
            }] : []);
            setLoading(false);
        } else {
        }
    }, [user, editData]);

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
            formData.append('productId', productId || '');

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
                form.resetFields();
                setFileList([]);
                onSuccess();
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    };

    const handleDeleteImage = async (id: any) => {
        try {
            const data = {
                productId: productId,
                imageId: id
            }
            const res = await deleteProductImage(data);
            if (res.status === true) {
                message.success(res.message);
                onSuccess();

            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }

    }

    return (
        <div>
            <Form
                form={form}
                variant="filled"
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ status: 'active' }}
            >
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
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the price',
                                },
                            ]}
                        >
                            <NumericInput
                                placeholder="Enter price"
                                value={price}
                                onChange={handlePriceChange}
                                maxLength={4}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            label="Discounted Price"
                            name="discountPrice"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please enter the discount price',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || parseFloat(value) < parseFloat(getFieldValue('price'))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error('Discounted price must be less than the price')
                                        );
                                    },
                                }),
                            ]}
                        >
                            <NumericInput
                                placeholder="Enter discount price"
                                value={discountPrice}
                                onChange={handleDiscountPriceChange}
                                maxLength={4}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: 'Please select a status' }]}
                        >
                            <Select
                                placeholder="Select a status"
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
                            name="description"
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
                                showCount
                                maxLength={
                                    validationRules.textLongLength.maxLength
                                }
                                placeholder="Enter description"
                            />
                        </Form.Item>
                    </Col>
                    {editData &&
                        editData.images?.map((image: any, index: any) => {
                            return (
                                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8} key={index}>
                                    <div key={image._id} className='textCenter'>
                                        <div style={{ marginBottom: '3px' }}>
                                            <Image
                                                src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/productImages/original/${image?.name}`}
                                                alt={image.name}
                                                style={{ width: '100px', height: '100px' }} />
                                            <div className="smallTopMargin"></div>
                                        </div>
                                        <Popconfirm
                                            title="Are you sure you want to delete this image?"
                                            onConfirm={() => { handleDeleteImage(image._id) }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="primary">Remove</Button>
                                        </Popconfirm>
                                    </div>
                                </Col>
                            )
                        })
                    }
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

