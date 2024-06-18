import ParaText from '@/app/commonUl/ParaText'
import TextEditor from '@/app/commonUl/TextEditor'
import AuthContext from '@/contexts/AuthContext'
import { handleFileCompression } from '@/lib/commonServices'
import ErrorHandler from '@/lib/ErrorHandler'
import { validationRules } from '@/lib/validations'
import { Button, Col, Drawer, Form, Input, message, Row, Select, Space, Upload, UploadFile } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import ForumData from './ForumData'
import { PlusOutlined } from '@ant-design/icons';
import { addUpdateForumData, deleteForumAttachment, getForumCategories } from '@/lib/commonApi'

interface Props {
    activeKey: string;
}
interface DataItem {
    title: string;
}
export default function Forums({ activeKey }: Props) {
    const [drawer, setDrawer] = useState(false);
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [forumId, setForumId] = useState('');
    const [reload, setReload] = useState(false);
    const [attachment, setAttachment] = useState<UploadFile[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState<DataItem[]>([]);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const Getdata = (data: any) => {
        setData(data)
    }

    const HandleSearch = (e: any) => {
        setSearchQuery(e.target.value)
    }

    useEffect(() => {
        const filterData = () => {
            const query = searchQuery.toLowerCase();
            const filtered = data.filter(item =>
                item.title.toLowerCase().includes(query)
            );
            setFilteredData(filtered);
        };

        filterData();
    }, [searchQuery, data]);
    const [category, setCategory] = useState<any>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchCategories();
    }, [])

    const handleItems = () => {
        setDrawer(true);
        form.resetFields();
        setForumId('');
        setAttachment([]);
    }

    const onFinish = async (values: any) => {
        try {
            setLoading(true);
            const formData = new FormData();
            if (attachment.length > 0) {
                formData.append('attachment', attachment[0]?.originFileObj as Blob);
            }
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('userId', user?._id || '');
            formData.append('forumId', forumId || '');
            formData.append('categoryId', values.category || '');
            formData.append('subCategoryId', values.subCategory || '');
            const res = await addUpdateForumData(formData);
            if (res.status == true) {
                message.success(res.message);
                form.resetFields();
                setDrawer(false);
                setLoading(false);
                setReload(!reload);
                setAttachment([]);
            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    }

    const handleEdit = (data: any) => {
        setForumId(data._id);
        setDrawer(true);
        form.setFieldsValue({
            title: data.title,
            description: data.description,
            forumId: data._id,
            category: data.categoryId._id,
            subCategory: data.subCategoryId._id,
        });
        if (data.attachment) {
            setAttachment([
                {
                    uid: '1',
                    name: data.attachment,
                    status: 'done',
                    url: `${process.env['NEXT_PUBLIC_IMAGE_URL']}/forumImages/medium/${data.attachment}`
                }
            ]);
        }
    };

    const handleQuillChange = (content: string) => {
        form.setFieldsValue({
            description: content
        });
    };

    const handleImageUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, '');
            setAttachment(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const handleRemoveAttachment = async () => {
        try {
            const data = {
                userId: user?._id,
                logo: null,
                forumId: forumId
            }
            const res = await deleteForumAttachment(data);
            if (res.status == true) {
                setAttachment([]);
                message.success(res.message);
                setReload(!reload);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await getForumCategories();
            if (res.status == true) {
                setCategory(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleRemove = () => {
        setAttachment([]);
    }



    return (
        <>
            <div className='gapMarginTopTwo'></div>
            <Row>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                    <ParaText size="large" fontWeightBold={600} color="PrimaryColor">
                        Forums
                    </ParaText>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                    <Space wrap className="floatEnd">
                        <Input type='search' placeholder='search' value={searchQuery} onChange={HandleSearch} style={{ height: '40px' }} />
                        <Button icon={<FaPlus />} type={'primary'} onClick={handleItems} style={{ height: '40px' }}>
                            Add Item
                        </Button>
                    </Space>
                </Col>
            </Row >
            <div className='gapMarginTopOne'></div>
            <ForumData activeKey={activeKey} reload={reload} onEdit={(data: any) => handleEdit(data)} getData={Getdata} filterData={filteredData} />
            <Drawer width={640} title="Add new item" onClose={() => setDrawer(false)} open={drawer}>
                <Form
                    layout='vertical'
                    size='large'
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={14}>
                        <Col md={24}>
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a title'
                                    },
                                    {
                                        max: validationRules.textLength.maxLength,
                                        message: `Title must be at most ${validationRules.textLength.maxLength} characters`
                                    },
                                    {
                                        min: validationRules.textLength.minLength,
                                        message: `Title must be at least ${validationRules.textLength.minLength} characters`
                                    }
                                ]}
                            >
                                <Input placeholder='Enter title' showCount maxLength={validationRules.textLength.maxLength} />
                            </Form.Item>

                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select the category'
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
                        <Col md={12}>
                            <Form.Item
                                label="Sub-category"
                                name="subCategory"
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
                        <Col md={24}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter Description!'
                                    },
                                    {
                                        max: validationRules.textEditor.maxLength,
                                        message: `Description must be at most ${validationRules.textEditor.maxLength} characters`

                                    },
                                    {
                                        min: validationRules.textEditor.minLength,
                                        message: `Description must be at least ${validationRules.textEditor.minLength} characters`
                                    }

                                ]}
                            >
                                <TextEditor
                                    theme="snow"
                                    onChange={handleQuillChange}
                                    placeholder="Enter forum description here"
                                    height={200}

                                />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label='Image'
                                name='attachment'
                            >
                                <Upload
                                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-330c5e6a2138"
                                    listType="picture-card"
                                    fileList={attachment}
                                    beforeUpload={handleImageUpload}
                                    accept=".jpg,.jpeg,.png"
                                    style={{ width: '100%' }}
                                    onRemove={handleRemove}

                                >
                                    {attachment.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col md={12} className={'textEnd'}>
                            <div style={{ textAlign: 'end', paddingTop: '50px' }}>
                                <Button type='primary' loading={loading} htmlType='submit'>
                                    {loading ? 'Submitting' : 'Submit Item'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    )
}
