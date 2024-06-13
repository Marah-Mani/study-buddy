import React from 'react'
import {
    Button,
    Cascader,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Row,
    Select,
    TreeSelect,
} from 'antd';
import UploadImage from '../UploadImage';

const { RangePicker } = DatePicker;
export default function FormType() {
    return (
        <div>
            <Form variant="filled" layout='vertical'>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Product" name="Product" rules={[{ required: true, message: 'Please Product!' }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            label="Category"
                            name="Category"
                            rules={[{ required: true, message: 'Please Category!' }]}
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            label="Price"
                            name="Price"
                            rules={[{ required: true, message: 'Please Price!' }]}
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Select All" name="Select All" rules={[{ required: true, message: 'Please Select!' }]}>
                            <Select />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item label="Gender" name="Gender" rules={[{ required: true, message: 'Please Select!' }]}>
                            <Select />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <Form.Item
                            label="Seller"
                            name="Seller"
                            rules={[{ required: true, message: 'Please Seller!' }]}
                        >
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            label="Published"
                            name="Published"
                            rules={[{ required: true, message: 'Please Published!' }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            label="Description"
                            name="Description"
                            rules={[{ required: true, message: 'Please Description!' }]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                        <Form.Item
                            label="File Upload"
                            name="Description"
                            rules={[{ required: true, message: 'Please File Select!' }]}
                        >
                            <UploadImage />
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

