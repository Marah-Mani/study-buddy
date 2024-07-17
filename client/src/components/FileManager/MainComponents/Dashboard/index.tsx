'use client'
import React, { useContext, useEffect, useState } from 'react'
import './style.css'
import { Layout, Row, Col, notification } from 'antd';
import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import { deleteFolder, getFileTypes, getFolder } from '@/lib/commonApi';
import Folders from '@/components/FileManager/folders';
import FilesData from '@/components/FileManager/filesData';
import GetFiles from '../../commonComponents/GetFiles';
import FileInformation from '../../commonComponents/FileInformation';
import CreateOrEditFolder from '../../commonComponents/CreateOrEditFolder';
import { downloadFolderInZipFile } from '@/lib/commonServices';
import NewFolder from '../newFolder';

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
    const [folderId, setFolderId] = useState("");
    const [action, setAction] = useState("")
    const { user } = useContext(AuthContext);
    const [fileId, setFileId] = useState('');
    const [folder, setFolder] = useState<any>();

    useEffect(() => {
        if (user && activeKey == '1') {
            getFolderData();
            getFileTypeData();
        }
    }, [user, activeKey])


    const getFolderData = async () => {
        const data = { userId: user?._id }
        const response = await getFolder(data)
        setFolderData(response.data)
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
        setFolder(folder)
        setFileId('');
    }


    return (
        <>
            <div>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={fileId || folder ? 19 : 24} xl={fileId || folder ? 19 : 24} xxl={fileId || folder ? 19 : 24}>
                        {!newFolderName ? (
                            <Content>
                                <div>
                                    <Row align='middle'>
                                        <Col xs={24} sm={14} md={14} lg={14} xl={14} xxl={14}>
                                            <ParaText size='extraSmall' color='black' fontWeightBold={500}> You can download and upload the file in the particular folder </ParaText> <br />
                                            {/* <ParaText size='textGraf' color='black' fontWeightBold={800}> {newFolderName ? newFolderName : "Folders"} </ParaText> */}
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
                                    {/* {user?.role !== 'user' && (
                                        <FilesData myFiles={myFiles} />
                                    )} */}
                                    {/* <div className='gapMarginTop'></div> */}
                                    <ParaText size='textGraf' color='black' fontWeightBold={800}> {newFolderName ? newFolderName : "Folders"} </ParaText>
                                    <Folders folderData={folderData} handleUpdate={handleUpdate}
                                        handleDoubleClick={handleDoubleClick} handleClick={handleClick}
                                    />

                                    <div className='gapMarginTop'></div>
                                    <Row align='middle'>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}><ParaText size='textGraf' color='black' fontWeightBold={600}>Recents  </ParaText></Col>
                                        {/* <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'><span className='viewAll'>View All</span></Col> */}
                                    </Row>
                                    <div className='gapMarginTopOne'></div>
                                    <GetFiles userId={user?._id} fileType={undefined} onSelectedId={(data: any) => { setFileId(data), setFolder(null) }} />
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
                    {(fileId || folder) &&
                        <Col xs={24} sm={24} md={24} lg={5} xl={5} xxl={5}>
                            <FileInformation fileId={fileId} folder={folder} />
                        </Col>
                    }

                </Row>
            </div>
        </>
    )
}
