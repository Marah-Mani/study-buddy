'use client'
import React, { useContext, useEffect, useState } from 'react'
import { Col, Dropdown, Image, MenuTheme, Row, Space, Switch, Table } from 'antd';
import type { TableProps } from 'antd';
import { IoMdEye } from "react-icons/io";
import { getFilesWithParams } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import DateFormat from '@/app/commonUl/DateFormat';
import AuthContext from '@/contexts/AuthContext';
import GetFileTypeIcon from '../GetFileTypeIcon';
import IsFavoriteFile from '../IsFavoriteFile';
import CanDeleteFile from '../CanDeleteFile';
import { getFavoriteFiles } from '@/lib/commonApi';
import GetFileSize from '../GetFileSize';
import ShortFileName from '../ShortFileName';
import { HiDotsVertical } from 'react-icons/hi';
import useDownloader from 'react-use-downloader';

interface Props {
    userId: any;
    fileType: any;
    activeKey?: any;
    onSelectedId?: any;
    sorting?: string;
    type?: string;
}

interface DataType {
    key: string;
    fileName: any;
    fileSize: any;
    createdAt: any;
    isFavorite: boolean;
    file: any;
}

export default function GetFiles({ userId, fileType, activeKey, onSelectedId, sorting, type }: Props) {
    const [files, setFiles] = useState<any>([]);
    const { user } = useContext(AuthContext);
    const [fileId, setFileId] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const { download } = useDownloader();

    useEffect(() => {
        if (activeKey == '3' && user) {
            fetchFavoriteFiles();
        } else {
            if (userId) fetchFiles(page, pageSize);
        }
        setFileId('');
    }, [activeKey, userId, page, pageSize]);

    const fetchFiles = async (page: any, pageSize: any) => {
        try {
            setLoading(true);
            const search = {
                ...(userId && { userId }),
                ...(fileType && { fileType }),
                ...(type == 'myFile' && { type }),
                role: user?.role,
                sorting: sorting,
                page,
                pageSize,
            }
            const queryString = JSON.stringify(search);
            const res = await getFilesWithParams(queryString);
            if (res.status === true) {
                setFiles(res.data);
                setTotal(res.totalCount);
                setLoading(false);
                if (!fileId && res.data.length > 0) {
                    handleFile(res.data[0]._id);
                    setFileId(res.data[0]._id);
                }

            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error)
        }
    }

    const fetchFavoriteFiles = async () => {
        try {
            setLoading(true);
            const res = await getFavoriteFiles(user?._id || '');
            if (res.status === true) {
                setFiles(res.data);
                setLoading(false);
                if (!fileId && res.data.length > 0) {
                    handleFile(res.data[0]._id);
                    setFileId(res.data[0]._id);
                }
            }
        } catch (error) {
            setLoading(false);
        }
    }

    const viewSelectedFile = (file: any) => {
        if (file.fileType === 'image/png' || file.fileType === 'image/jpeg' || file.fileType === 'image/jpg' || file.fileType.startsWith('image/')) {
            handlePreview(file.filePath);
        } else {
            window.open(`${process.env['NEXT_PUBLIC_IMAGE_URL']}/fileManager/${file.filePath}`, 'blank');
        }
    };

    const getMenuItems = (file: any) => [
        {
            key: 'view',
            label: 'View',
            onClick: () => viewSelectedFile(file)
        },
        {
            key: 'dow',
            label: 'Download',
            onClick: async () => download(`${process.env['NEXT_PUBLIC_IMAGE_URL']}/fileManager/${file.filePath}`, file.fileName)
        },
    ];


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
                <Space size="middle" className='iconColorChange'>
                    {user?.role !== 'user' && (
                        <span className='eyes' onClick={() => { handleFile(record.key) }}> <IoMdEye /></span>
                    )}
                    {!user?.role || user?.role !== 'user' || type == 'myFile' ? (
                        <CanDeleteFile userId={user?._id} fileId={record.key} reload={() => { fetchFiles(page, pageSize) }} />
                    ) : null}
                    <IsFavoriteFile activeKey={activeKey}
                        onReload={(data: any) => {
                            if (data == 'favorites') {
                                fetchFavoriteFiles();
                            } else {
                                fetchFiles(page, pageSize)
                            }
                        }} isFavorite={record?.isFavorite} userId={user?._id} fileId={record.key} />
                    <Dropdown
                        menu={{ items: getMenuItems(record?.file) }}
                        trigger={['click']}
                        className='viewAll'
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <HiDotsVertical />
                        </a>
                    </Dropdown>
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

    const handleTableChange = (pagination: any) => {
        setPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const data: DataType[] = files.map((items: any) => {
        return {
            key: items._id,
            fileName: <Row align='middle' onClick={() => { handleFile(items._id) }}>
                <Col md={2}><GetFileTypeIcon fileType={items.fileType} size={30} /></Col>
                <Col md={22}>
                    <div
                        style={{ color: `${fileId}` === items._id ? '#efa24b' : 'inherit', cursor: 'pointer' }}
                    >
                        <ShortFileName fileName={items.fileName} short={30} />
                    </div>
                </Col>
            </Row>,
            fileSize: (
                <div style={{ color: `${fileId}` === items._id ? '#efa24b' : 'inherit', cursor: 'pointer' }} onClick={() => { handleFile(items._id) }} >
                    <GetFileSize fileSize={items.fileSize} />
                </div>),
            createdAt: (
                <div style={{ color: `${fileId}` === items._id ? '#efa24b' : 'inherit', cursor: 'pointer' }} onClick={() => { handleFile(items._id) }} >
                    <DateFormat date={items.createdAt} />
                </div>),
            isFavorite: items.isFavorite,
            file: items
        }
    })

    return (
        <>
            <div id='recentFiles'>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        // total: total,
                        showSizeChanger: true,
                        onChange: handleTableChange,
                        onShowSizeChange: handleTableChange,
                    }}
                    loading={loading}
                />

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
