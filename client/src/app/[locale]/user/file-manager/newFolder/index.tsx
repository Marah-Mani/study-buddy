import ParaText from "@/app/commonUl/ParaText";
import { Button, Col, message, Modal, Row } from "antd";
import DropdownMenu from "../DropdownMenu";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import FileUpload from "../commonComponents/FileUpload";
import BackButton from "../commonComponents/BackButton";
import GetFileTypeIcon from "../commonComponents/GetFileTypeIcon";
import GetFileTypeName from "../commonComponents/GetFileTypeName";
import GetFileSize from "../commonComponents/GetFileSize";
import { deleteFolder, getFilesByFolder, getFolder } from "@/lib/userApi";
import AuthContext from "@/contexts/AuthContext";
import CreateOrEditFolder from "../commonComponents/CreateOrEditFolder";
import { downloadFolderInZipFile } from "@/lib/commonServices";
import Folders from "@/components/FileManager/folders";


interface props {
    handleUpdate?: (folder: any, action: any) => void;
    newFolderName?: any;
    getParent?: any;
    folderData?: any;
    fileWithFolderId?: any;
    getFilesWithId?: any;
    onBack?: any
}

export default function NewFolder({ newFolderName, getParent, onBack }: props) {
    const [isModalOpenFile, setIsModalOpenFile] = useState(false);
    const [folderId, setFolderId] = useState(newFolderName._id)
    const [fileWithFolderId, setFileWithFolderId] = useState<any>([]);
    const { user } = useContext(AuthContext);
    const [folderData, setFolderData] = useState<string[]>([]);
    const [singleFolder, setSingleFolder] = useState<any>();
    const [action, setAction] = useState("")
    const [folderRename, setFolderRename] = useState<any>();

    useEffect(() => {
        getFilesWithId();
        getFolderData();
    }, [])

    const getFilesWithId = async () => {
        const res = await getFilesByFolder(folderId);
        setFileWithFolderId(res.data)
    }

    const getFolderData = async () => {
        const data = { userId: user?._id, folderId }
        const response = await getFolder(data)
        setFolderData(response.data)
        if (response.data.length > 0) {
            setSingleFolder(response.data[0]);
        }
    }

    const handleReload = (data: any) => {
        getFolderData();
    }


    const handleDoubleClick = async (folder: any) => {
        setFolderId(folder._id);
        getParent(folderId);
    }
    const fileModal = () => {
        setIsModalOpenFile(true)
    }

    const handleOkFile = () => {
        setIsModalOpenFile(false)
    }
    const handleCancelFile = () => {
        setIsModalOpenFile(false)
    }

    const items = [
        { label: 'Delete', action: 'delete' },
        { label: 'Rename', action: 'rename' },
        { label: 'Download', action: 'download' },
    ];

    const handleUpdate = async (folder: any, action: any) => {
        if (action === "rename") {
            setAction(action)
            setFolderRename(folder)
        }
        else if (action === "delete") {
            const data = { folderId: folder._id, userId: user?._id }
            const res = await deleteFolder(data)
            if (res.status == true) {
                message.success(res.message);
                getFolderData()
            }
        }
        else if (action === "download") {
            await downloadFolderInZipFile(folder);
        }
    };

    const handleClick = (folder: any) => {
        setSingleFolder(folder)
    }

    return (
        <>
            <Row align='middle'>
                <Col xs={24} sm={14} md={14} lg={14} xl={14} xxl={14}>
                </Col>

            </Row>
            <div className='gapMarginTopOne'></div>
            <Row align='middle' >
                <Col md={1}
                    onClick={() => {
                        setFolderId('')
                        onBack()
                    }}
                >
                    <BackButton />
                </Col>
                <Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4}>
                    <ParaText size='textGraf' color='black' fontWeightBold={600}>{newFolderName.folderName}  </ParaText>
                </Col>
                <Col xs={24} sm={17} md={17} lg={17} xl={17} xxl={17}>
                    <div className='flexButton'>
                        <div>
                            <CreateOrEditFolder currentInnerFolderId={folderId} folderRename={folderRename} action={action} getFolderData={handleReload} setFolderRename={setFolderRename} />
                        </div>
                        <div>
                            <Button icon={<AiOutlinePlusCircle />} style={{ background: '#23b7e5', display: 'flex', alignItems: 'center' }}
                                type='primary' onClick={fileModal}>
                                Upload File
                            </Button>
                            <Modal
                                title="File Upload"
                                open={isModalOpenFile}
                                onOk={handleOkFile}
                                onCancel={handleCancelFile}
                                footer={null}
                                width={500}
                            >
                                <FileUpload handleCancelFile={handleCancelFile} folderId={folderId} getFilesWithId={getFilesWithId} />
                            </Modal>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={2} md={2} lg={2} xl={2} xxl={2} className='textEnd'>
                    <span className='viewAll'>View All</span>
                </Col>
            </Row >
            <div className='gapMarginTopOne'></div>

            <Row gutter={[16, 16]}>
                <>
                    {folderData.map((folder: any, index: any) => (
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}
                            key={folder._id || index}
                        >
                            <Link href='#'>
                                <div className='cardCommn active'
                                    onDoubleClick={() => handleDoubleClick(folder)}
                                // onClick={() => handleClick(folder)}
                                >
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <div><GetFileTypeIcon fileType={folder.fileType} size={30} /></div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                            <DropdownMenu onUpdate={(action: any) => handleUpdate(folder, action)} items={items} />
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <ParaText size='textGraf' color='black' fontWeightBold={600}>
                                                {folder.folderName}
                                            </ParaText>
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
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}                    >

                        <Folders folderData={folderData} handleUpdate={handleUpdate}
                            handleDoubleClick={handleDoubleClick} handleClick={handleClick}
                        />
                    </Col>
                </>
            </Row>
            <div className='gapMarginTopOne'></div>

            <>
                <Row gutter={[16, 16]}>
                    <>
                        {fileWithFolderId ? fileWithFolderId.map((file: any, index: any) => (
                            <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6} key={index}>
                                <Link href='#'>
                                    <div className='cardCommn' >
                                        <Row align='middle'>
                                            <Col xs={8} sm={12} md={12} lg={12} xl={12} xxl={12}><GetFileTypeIcon fileType={file.fileType} size={30} /></Col>
                                            <Col xs={16} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd' >
                                                <ParaText size='textGraf' color='black' fontWeightBold={600}>
                                                    <GetFileTypeName fileType={file.fileType} />
                                                </ParaText>
                                                <ParaText size='smallExtra' color='black' className='dBlock'>
                                                    <GetFileSize fileSize={file.fileSize} />
                                                </ParaText>
                                                <ParaText size='smallExtra' color='black' className='dBlock'>{file.count}</ParaText>
                                            </Col>
                                        </Row>
                                    </div>
                                </Link>
                            </Col>
                        )) : null}
                    </>
                </Row>
            </>
        </>
    )
}
