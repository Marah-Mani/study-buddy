'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Image, MenuTheme, Row, Space, Switch, Table } from 'antd';
import type { TableProps } from 'antd';
import { IoMdEye } from "react-icons/io";
import { getFilesWithParams } from '@/lib/userApi';
import ErrorHandler from '@/lib/ErrorHandler';
import DateFormat from '@/app/commonUl/DateFormat';
import AuthContext from '@/contexts/AuthContext';
import GetFileTypeIcon from '../GetFileTypeIcon';
import IsFavoriteFile from '../IsFavoriteFile';
import CanDeleteFile from '../CanDeleteFile';
import { getFavoriteFiles } from '@/lib/commonApi';
import GetFileSize from '../GetFileSize';

interface Props {
    userId: any;
    fileType: any;
    activeKey?: any;
    onSelectedId?: any;
    sorting?: string;
}

interface DataType {
    key: string;
    fileName: any;
    fileSize: any;
    createdAt: any;
    isFavorite: boolean;
}

export default function GetFiles({ userId, fileType, activeKey, onSelectedId, sorting }: Props) {
    const [files, setFiles] = useState<any>([]);
    const { user } = useContext(AuthContext);
    const [fileId, setFileId] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (activeKey == '3' && user) {
            fetchFavoriteFiles();
        } else {
            fetchFiles();
        }
        setFileId('');
    }, [activeKey, user]);

    const fetchFiles = async () => {
        try {
            const search = {
                ...(userId && { userId }),
                ...(fileType && { fileType }),
                sorting: sorting
            }
            const queryString = JSON.stringify(search);
            const res = await getFilesWithParams(queryString);
            if (res.status === true) {
                setFiles(res.data);
                if (!fileId) {
                    handleFile(res.data[0]._id);
                    setFileId(res.data[0]._id);
                }
            }
        } catch (error) {
            ErrorHandler.showNotification(error)
        }
    }

    const fetchFavoriteFiles = async () => {
        try {
            const res = await getFavoriteFiles(user?._id || '');
            if (res.status === true) {
                setFiles(res.data);
                if (!fileId) {
                    if (res.data[0]._id) {
                        handleFile(res.data[0]._id);
                        setFileId(res.data[0]._id);
                    }
                }
            }
        } catch (error) {
            ErrorHandler.showNotification(error)
        }
    }


    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'File Name',
            dataIndex: 'fileName',
            key: 'fileName',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Size',
            dataIndex: 'fileSize',
            key: 'fileSize',
        },
        {
            title: 'Date Modified',
            key: 'createdAt',
            dataIndex: 'createdAt',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <span className='eyes' onClick={() => { handleFile(record.key) }}> <IoMdEye /></span>
                    <CanDeleteFile userId={user?._id} fileId={record.key} reload={() => { fetchFiles() }} />
                    <IsFavoriteFile activeKey={activeKey}
                        onReload={(data: any) => {
                            if (data == 'favorites') {
                                fetchFavoriteFiles();
                            } else {
                                fetchFiles()
                            }
                        }} isFavorite={record?.isFavorite} userId={user?._id} fileId={record.key} />
                </Space>
            ),
        },
    ];

    const handleFile = (fileId: any) => {
        setFileId(fileId);
        onSelectedId(fileId)
    };

    const handlePreview = (imageUrl: any) => {
        setPreviewImage(`${process.env['NEXT_PUBLIC_IMAGE_URL']}/fileManager/${imageUrl}`);
        setPreviewVisible(true);
    };

    const data: DataType[] = files.map((items: any) => {
        return {
            key: items._id,
            fileName: <Row align='middle' gutter={[6, 6]} onClick={() => { handleFile(items._id) }}>
                <Col><GetFileTypeIcon fileType={items.fileType} size={30} /></Col>
                <Col>
                    <Image.PreviewGroup>
                        <Image
                            src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/fileManager/${items.filePath}`}
                            style={{ display: 'none' }}
                            preview={{
                                visible: false,
                                mask: null,
                                maskClassName: null as any,
                            }}
                        />
                    </Image.PreviewGroup>
                    <p
                        onClick={() => {
                            if (items.fileType === 'image/png' || items.fileType === 'image/jpeg' || items.fileType === 'image/jpg' || items.fileType.startsWith('image/')) {
                                handlePreview(items.filePath);
                            } else {
                                window.open(`${process.env['NEXT_PUBLIC_IMAGE_URL']}/fileManager/${items.filePath}`, 'blank');
                            }
                        }}
                        style={{ color: `${fileId}` === items._id ? 'rgb(1 140 255)' : 'inherit', cursor: 'pointer' }}
                    >
                        {items.fileName.length > 50 ? items.fileName.slice(0, 50) + '...' : items.fileName}
                    </p>
                </Col>
            </Row>,
            fileSize: (
                <div style={{ color: `${fileId}` === items._id ? 'rgb(1 140 255)' : 'inherit', cursor: 'pointer' }} onClick={() => { handleFile(items._id) }} >
                    <GetFileSize fileSize={items.fileSize} />
                </div>),
            createdAt: (
                <div style={{ color: `${fileId}` === items._id ? 'rgb(1 140 255)' : 'inherit', cursor: 'pointer' }} onClick={() => { handleFile(items._id) }} >
                    <DateFormat date={items.createdAt} />
                </div>),
            isFavorite: items.isFavorite,
        }
    })

    return (
        <>
            <div id='recentFiles'>
                <Table columns={columns} dataSource={data} />

                <Image.PreviewGroup
                    preview={{
                        visible: previewVisible,
                        onVisibleChange: (visible) => setPreviewVisible(visible),
                    }}
                >
                    <Image
                        src={previewImage}
                        style={{ display: 'none' }}
                        preview={{
                            visible: previewVisible,
                            src: previewImage,
                            onVisibleChange: (visible) => setPreviewVisible(visible),
                        }}
                    />
                </Image.PreviewGroup>
            </div>
        </>
    )
}
