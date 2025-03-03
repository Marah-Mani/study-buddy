import ParaText from "@/app/commonUl/ParaText";
import { Button, Col, message, Modal, Row, Image, Dropdown } from "antd";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { deleteFolder, getFilesByFolder, getFolder } from "@/lib/commonApi";
import AuthContext from "@/contexts/AuthContext";
import { downloadFolderInZipFile } from "@/lib/commonServices";
import { FcOpenedFolder } from "react-icons/fc";
import BackButton from "../../commonComponents/BackButton";
import CreateOrEditFolder from "../../commonComponents/CreateOrEditFolder";
import DropdownMenu from "../../commonComponents/DropdownMenu";
import FileUpload from "../../commonComponents/FileUpload";
import GetFileSize from "../../commonComponents/GetFileSize";
import GetFileTypeIcon from "../../commonComponents/GetFileTypeIcon";
import GetFileTypeName from "../../commonComponents/GetFileTypeName";
import ShortFileName from "../../commonComponents/ShortFileName";
import { HiDotsVertical } from "react-icons/hi";
import useDownloader from "react-use-downloader";

interface props {
    handleUpdate?: (folder: any, action: any) => void;
    newFolderName?: any;
    getParent?: any;
    folderData?: any;
    fileWithFolderId?: any;
    getFilesWithId?: any;
    onBack?: any;
    onSelectedId?: any;
    currentInnerFolderId?: any;
}

export default function NewFolder({ newFolderName, onBack, onSelectedId, currentInnerFolderId }: props) {
    const [isModalOpenFile, setIsModalOpenFile] = useState(false);
    const [folderId, setFolderId] = useState(newFolderName._id)
    const [fileWithFolderId, setFileWithFolderId] = useState<any>([]);
    const { user } = useContext(AuthContext);
    const [folderData, setFolderData] = useState<string[]>([]);
    const [singleFolder, setSingleFolder] = useState<any>();
    const [action, setAction] = useState("")
    const [folderRename, setFolderRename] = useState<any>();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const { download } = useDownloader();
    const [folderName, setFolderName] = useState(newFolderName.folderName);


    useEffect(() => {
        getFilesWithId(newFolderName._id);
        getFolderData(newFolderName._id);
    }, [])

    const getFilesWithId = async (folderId: string) => {
        const res = await getFilesByFolder(folderId);
        setFileWithFolderId(res.data)
    }

    const getFolderData = async (folderId: string) => {
        const data = { userId: user?._id, folderId }
        const response = await getFolder(data)
        setFolderData(response.data);
        if (response.data.length > 0) {
            setSingleFolder(response.data[0]);
        }
    }

    const handleReload = () => {
        getFolderData(folderId);
        getFilesWithId(folderId);
    }


    const handleDoubleClick = async (folder: any) => {
        setFolderId(folder._id);
        setFolderName(folder.folderName);
        await getFolderData(folder._id);
        await getFilesWithId(folder._id);
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
                getFolderData(folderId)
            }
        }
        else if (action === "download") {
            await downloadFolderInZipFile(folder);
        }
    };

    const handlePreview = (imageUrl: any) => {
        setPreviewImage(`${process.env['NEXT_PUBLIC_IMAGE_URL']}/fileManager/${imageUrl}`);
        setPreviewVisible(true);
    };

    const handleFile = (fileId: any) => {
        onSelectedId(fileId)
    };

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

    return (
        <>
            <Row align='middle'>
                <Col xs={24} sm={14} md={14} lg={14} xl={14} xxl={14}>
                </Col>

            </Row>
            <div className='gapMarginTopOne'></div>
            <Row align='middle' >
                <Col xs={2} sm={2} md={1} lg={1} xl={1} xxl={1}
                    onClick={() => {
                        setFolderId('')
                        onBack(folderId)
                    }}
                >
                    <div>
                        <BackButton />
                    </div>
                </Col>
                <Col xs={22} sm={22} md={4} lg={4} xl={4} xxl={4}>
                    <ParaText size='textGraf' color='black' fontWeightBold={600}>{folderName}  </ParaText>
                </Col>
                <Col xs={24} sm={17} md={17} lg={17} xl={17} xxl={17}>
                    <div className='flexButton'>
                        <div>
                            <CreateOrEditFolder currentInnerFolderId={folderId} folderRename={folderRename} action={action} getFolderData={handleReload} setFolderRename={setFolderRename} />
                        </div>
                        <div>
                            <Button icon={<AiOutlinePlusCircle className="iconColorChange" />} style={{ background: '#23b7e5', display: 'flex', alignItems: 'center', borderRadius: '30px' }}
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
                                <FileUpload handleCancelFile={handleCancelFile} folderId={folderId} getFilesWithId={handleReload} />
                            </Modal>
                        </div>
                    </div>
                </Col>
            </Row >
            <div className='gapMarginTopOne'></div>

            <Row gutter={[16, 16]}>
                <>
                    {folderData.map((folder: any, index: any) => (
                        <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}
                            key={folder._id || index}
                        >
                            <Link href='#' onClick={() => currentInnerFolderId(folder)}>
                                <div className='cardCommn active'
                                    onDoubleClick={() => handleDoubleClick(folder)}
                                >
                                    <Row>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <div><FcOpenedFolder size={30} /></div>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                            <DropdownMenu onUpdate={(action: any) => handleUpdate(folder, action)} items={items} />
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <ParaText size='textGraf' color='black' fontWeightBold={600}> {folder.folderName} </ParaText>
                                            <ParaText size='smallExtra' color='black' className='dBlock'>{folder.fileCount} Files</ParaText>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                                            <br />
                                            <ParaText size='smallExtra' color='black' className='dBlock' fontWeightBold={600}> {folder.totalSize} </ParaText>
                                        </Col>
                                    </Row>
                                </div>
                            </Link>
                        </Col>
                    ))}
                </>
            </Row>
            <div className='gapMarginTopOne'></div>
            <>
                <Row gutter={[16, 16]}>
                    <>
                        {fileWithFolderId && fileWithFolderId.map((file: any, index: any) => (
                            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} key={index} onClick={() => { handleFile(file._id) }}>
                                <div className='cardCommn'
                                    style={{ color: '#efa24b', cursor: 'pointer' }}
                                >
                                    <Row>
                                        <Col xs={23} sm={23} md={23} lg={23} xl={23} xxl={23} >
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <div>
                                                    <ParaText size='textGraf' color='black' fontWeightBold={600}>
                                                        <GetFileTypeIcon fileType={file.fileType} size={30} />
                                                    </ParaText>
                                                </div>
                                                <div>
                                                    <ParaText size='textGraf' color='black' fontWeightBold={600}>
                                                        <ShortFileName fileName={file.fileName} short={50} />
                                                    </ParaText>
                                                </div>
                                                <div>
                                                    <ParaText size='textGraf' color='black' fontWeightBold={600}>
                                                        <GetFileTypeName fileType={file.fileType} />
                                                    </ParaText>
                                                </div>
                                                <div style={{ padding: '2px' }}>
                                                    <ParaText size='smallExtra' color='black' className='dBlock'>
                                                        <GetFileSize fileSize={file.fileSize} />
                                                    </ParaText>
                                                </div>
                                                <div>

                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1} >
                                            <Dropdown
                                                menu={{ items: getMenuItems(file) }}
                                                trigger={['click']}
                                                className='viewAll'
                                            >
                                                <a onClick={(e) => e.preventDefault()}>
                                                    <HiDotsVertical />
                                                </a>
                                            </Dropdown>
                                        </Col>
                                    </Row>

                                </div>
                            </Col>
                        ))}
                    </>
                </Row>
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
            </>
        </>
    )
}
