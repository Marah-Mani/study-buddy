'use client'
import React, { useContext, useEffect, useState } from 'react'
import './style.css'
import { Layout, Row, Col, notification } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import { deleteFolder, downloadZipFile, getFileTypes, getFilesByFolder, getFolder } from '@/lib/userApi';

import Folders from '@/components/FileManager/folders';
import FilesData from '@/components/FileManager/filesData';
import GetFiles from '../../commonComponents/GetFiles';
import NewFolder from '../../newFolder';
import FileInformation from '../../commonComponents/FileInformation';

import BackButton from '../../commonComponents/BackButton';
import CreateOrEditFolder from '../../commonComponents/CreateOrEditFolder';
import { downloadFolderInZipFile } from '@/lib/commonServices';


interface Folder {
    folderName: string;
    description: string;
}

interface Props {
    activeKey?: any;
    initialState?: any;
}

const { Content } = Layout;
export default function Dashboard({ activeKey, initialState }: Props) {
    const [folderData, setFolderData] = useState<string[]>([]);
    const [myFiles, setMyFiles] = useState([]);
    const [folderRename, setFolderRename] = useState<any>();
    const [newFolderName, setNewFolderName] = useState<any>("");
    const [singleFolder, setSingleFolder] = useState<Folder>();
    const [folderId, setFolderId] = useState("");
    const [action, setAction] = useState("")
    const { user } = useContext(AuthContext);
    const [fileId, setFileId] = useState('');

    useEffect(() => {
        if (user && activeKey == '1') {
            getFolderData();
            getFileTypeData();
            setFileId('');
        }
    }, [user, folderId, activeKey])


    const getFolderData = async () => {
        const data = { userId: user?._id }
        const response = await getFolder(data)
        setFolderData(response.data)
        if (response.data.length > 0) {
            setSingleFolder(response.data[0]);
        }
    }


    const getParentId = (id: any) => {
        setFolderId(id)
    }

    const getFileTypeData = async () => {
        const res = await getFileTypes(user?._id);
        setMyFiles(res.data)
    }

    const handleUpdate = async (folder: any, action: any) => {
        if (action === "rename") {
            setAction(action)
            setFolderRename(folder)
        }
        else if (action === "delete") {
            const data = { folderId: folder._id, userId: user?._id }
            const res = await deleteFolder(data)
            if (res) {
                notification.success({ message: res.message });
                getFolderData()
            }
        }
        else if (action === "download") {
            await downloadFolderInZipFile(folder);
        }
    };


    const handleDoubleClick = (folder: any) => {
        setNewFolderName(folder);
    };
    const handleClick = (folder: any) => {
        setSingleFolder(folder)
    }


    return (
        <>
            <div>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={19} xl={19} xxl={19}>
                        {!newFolderName ? (
                            <Content>
                                <div>
                                    <Row align='middle'>
                                        <Col xs={24} sm={1} md={1} lg={1} xl={1} xxl={1}>
                                            <BackButton />
                                        </Col>
                                        <Col xs={24} sm={14} md={14} lg={14} xl={14} xxl={14}>
                                            <ParaText size='textGraf' color='black' fontWeightBold={800}> {newFolderName ? newFolderName : "Folders"} </ParaText>
                                        </Col>
                                        {user?.role == 'admin' &&
                                            <Col className='textEnd' xs={24} sm={9} md={9} lg={9} xl={9} xxl={9}>
                                                <div className='flexButton'>
                                                    <div>
                                                        <CreateOrEditFolder
                                                            folderRename={folderRename}
                                                            setFolderRename={setFolderRename}
                                                            action={action}
                                                            getFolderData={getFolderData} currentInnerFolderId={folderId} />
                                                    </div>
                                                </div>
                                            </Col>
                                        }
                                    </Row>
                                </div>
                                <div className="mediumTopMargin"></div>
                                <div className='siteLayoutBackground'>
                                    <FilesData myFiles={myFiles} />
                                    <div className='gapMarginTop'></div>

                                    <Folders folderData={folderData} handleUpdate={handleUpdate}
                                        handleDoubleClick={handleDoubleClick} handleClick={handleClick}
                                    />

                                    <div className='gapMarginTop'></div>
                                    <Row align='middle'>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}><ParaText size='textGraf' color='black' fontWeightBold={600}>Recents  </ParaText></Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'><span className='viewAll'>View All</span></Col>
                                    </Row>
                                    <div className='gapMarginTopOne'></div>
                                    <GetFiles userId={user?._id} fileType={undefined} onSelectedId={(data: any) => setFileId(data)} />
                                </div>
                            </Content>
                        ) : (
                            <>
                                <NewFolder
                                    newFolderName={newFolderName}
                                    getParent={getParentId}
                                    folderData={folderData}
                                    onBack={() => {
                                        setNewFolderName(''),
                                            getParentId(''),
                                            getFolderData();

                                    }}
                                />
                            </>
                        )}
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={5} xl={5} xxl={5}>
                        <FileInformation fileId={fileId} />
                    </Col>
                </Row>
            </div>
        </>
    )
}
