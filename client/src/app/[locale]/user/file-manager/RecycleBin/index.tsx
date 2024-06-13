import React, { useContext, useEffect, useState } from 'react'
import { GetRecycledFilesAndFolders, RecoverFolder, RecoverFile, deleteFolderPermanently, deleteFilePermanently } from '@/lib/userApi';
import AuthContext from '@/contexts/AuthContext';
import { Col, Dropdown, Menu, Row } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import Link from 'next/link';
import { FcOpenedFolder } from 'react-icons/fc';
import { HiDotsVertical } from 'react-icons/hi';
import { CiFileOn } from "react-icons/ci";
import './style.css'

export default function RecycleBin({ activeKey }: any) {
    const [folderData, setFolderData] = useState<string[]>([]);
    const [fileData, setFileData] = useState<string[]>([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && activeKey === '5') {
            getFolderData();
        }
    }, [user, activeKey])


    const getFolderData = async () => {
        const response = await GetRecycledFilesAndFolders(user?._id)
        setFolderData(response.data.recycledFolders)
        setFileData(response.data.recycledFiles)
    }

    const handleMenuClick = async (action: string, folderId: string) => {
        if (action === 'restore') {
            await RecoverFolder({ folderId });
            getFolderData();
        } else if (action === 'delete') {
            await deleteFolderPermanently({ folderId });
            getFolderData();
        }
    };

    const handlefileMenuClick = async (action: string, fileId: string) => {
        if (action === 'restore') {
            await RecoverFile({ fileId });
            getFolderData();
        } else if (action === 'delete') {
            await deleteFilePermanently({ fileId });
            getFolderData();
        }
    };


    const items = (folderId: string) => (
        <Menu>
            <Menu.Item key="restore" onClick={() => handleMenuClick('restore', folderId)}>Restore</Menu.Item>
            <Menu.Item key="delete" onClick={() => handleMenuClick('delete', folderId)}>Delete Permanantly</Menu.Item>
        </Menu>
    );

    const renderFileMenu = (fileId: string) => (
        <Menu>
            <Menu.Item key="restore" onClick={() => handlefileMenuClick('restore', fileId)}>Restore</Menu.Item>
            <Menu.Item key="delete" onClick={() => handlefileMenuClick('delete', fileId)}>Delete Permanently</Menu.Item>
        </Menu>
    );


    return (
        <>
            <Row align='middle'>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}><ParaText size='textGraf' color='black' fontWeightBold={600}>Folders & Files </ParaText></Col>
            </Row>
            <div className='gapMarginTopOne'></div>
            <Row gutter={[16, 16]}>
                <>
                    {folderData.map((folder: any, index: any) => (
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={3} key={folder._id || index}>
                            <Link href='#'>
                                <div className='cardCommn active'>
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <div><FcOpenedFolder size={30} /></div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                            <Dropdown overlay={items(folder._id)} trigger={['click']} className='viewAll'>
                                                <a onClick={(e) => { e.preventDefault(); }}>
                                                    <HiDotsVertical />
                                                </a>
                                            </Dropdown>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <ParaText size='textGraf' color='black' fontWeightBold={600}> {folder.folderName} </ParaText>
                                            <ParaText size='smallExtra' color='black' className='dBlock'>246 Files</ParaText>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                            <br />
                                            <ParaText size='smallExtra' color='black' className='dBlock' fontWeightBold={600}> 214.32MB </ParaText>
                                        </Col>
                                    </Row>

                                </div>
                            </Link>
                        </Col>
                    ))}
                </>
            </Row>

            <div className='gapMarginTopOne'></div>
            <Row gutter={[16, 16]}>
                {fileData.map((file: any, index: any) => (
                    <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={3} key={file._id}>
                        <Link href='#'>
                            <div className='cardCommn active'>
                                <Row>
                                    <Col span={12}>
                                        <CiFileOn size={30} />
                                    </Col>
                                    <Col span={12} className='textEnd'>
                                        <Dropdown overlay={renderFileMenu(file._id)} trigger={['click']} className='viewAll'>
                                            <a onClick={(e) => { e.preventDefault(); }}>
                                                <HiDotsVertical />
                                            </a>
                                        </Dropdown>
                                    </Col>
                                    <Col span={12}>
                                        <ParaText size='textGraf' color='black' fontWeightBold={600}>{file.fileName}</ParaText>
                                    </Col>
                                    <Col span={12} className='textEnd'>
                                        <br />
                                        <ParaText size='smallExtra' color='black' className='dBlock' fontWeightBold={600}>{file.size}</ParaText>
                                    </Col>
                                </Row>
                            </div>
                        </Link>
                    </Col>
                ))}
            </Row>
        </>
    )
}
