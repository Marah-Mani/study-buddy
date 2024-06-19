'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Form, Row, Button, message, Input, notification } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { createFolder, updateFolder } from '@/lib/commonApi';
import AuthContext from '@/contexts/AuthContext';
import { validationRules } from '@/lib/validations';
import ErrorHandler from '@/lib/ErrorHandler';

interface props {
    folderRename?: any;
    onClose: any;
    currentInnerFolderId: any
}

export default function FormModal({ folderRename, onClose, currentInnerFolderId }: props) {
    const [form] = Form.useForm();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        form.setFieldsValue({
            folderName: folderRename?.folderName || ''
        });
    }, [folderRename, form]);

    const onFinish = async (values: any) => {
        const currentFolderId = currentInnerFolderId;
        const userId = user?._id;
        const folderId = folderRename?._id;
        const valuesWithUserId = { ...values, userId, folderId, currentInnerFolderId, currentFolderId };

        try {
            const response = folderId ? await updateFolder(valuesWithUserId) : await createFolder(valuesWithUserId);
            if (response.status == true) {
                message.success(response.message);
                form.resetFields();
                onClose();
            } else {
                notification.error({ message: response.message || (folderId ? 'Update failed' : 'Creation failed') });
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    return (
        <>
            <Form form={form} onFinish={onFinish} layout="vertical" >
                <FormItem label="Folder Name" name="folderName"
                    rules={[
                        { required: true, message: 'Please enter the folder name' },
                        {
                            max: validationRules.textLength.maxLength,
                            message: `Folder name must be at most ${validationRules.textLength.maxLength} characters`
                        }
                    ]}
                >
                    <Input type='text' placeholder='folderName' />
                </FormItem>
                <FormItem label="Description" name="description"
                    rules={[
                        {
                            max: validationRules.textLength.maxLength,
                            message: `Description must be at most ${validationRules.textLength.maxLength} characters`
                        }
                    ]}
                >
                    <Input.TextArea placeholder='folderName' />
                </FormItem>
                <Row align="stretch" gutter={[16, 16]}>
                    <Col lg={4} md={4} sm={12} xs={12}>
                        <Button type="primary" htmlType="submit" className="w100">
                            Add Folder
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

