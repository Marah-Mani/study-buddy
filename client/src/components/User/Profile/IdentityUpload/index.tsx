import ParaText from '@/app/commonUl/ParaText'
import AuthContext from '@/contexts/AuthContext';
import { Button, Card, Col, message, Modal, Popconfirm, Row, Select, Image } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import ErrorHandler from '@/lib/ErrorHandler';
import { deleteUserDocument, getUserDocuments, uploadIdentityDocuments } from '@/lib/userApi';
// import Image from 'next/image'
import { FaTrash } from 'react-icons/fa';
interface Props {
    activeKey: string
}

export default function IdentityUpload({ activeKey }: Props) {
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const [fileList, setFileList] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [documentType, setDocumentType] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [messages, setmessage] = useState("Please select type of document");

    useEffect(() => {
        if (activeKey == '3') {
            if (user) fetchDocuments();
        }
    }, [activeKey, user])

    const fetchDocuments = async () => {
        try {
            const data = {
                userId: user?._id
            }
            const res = await getUserDocuments(data);
            if (res.status === true) {
                setUserData(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }
    // const statusFile = fileList.length == 1 ? true : false;
    const props = {
        name: 'file',
        multiple: false,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        fileList,
        disabled: fileList?.length == 1 ? true : false,
        accept: '.pdf,.png,.jpg,.jpeg',

        async beforeUpload(file: any) {
            // Check if the file type is PDF
            if (file.type === 'application/pdf') {
                // PDF file, no compression needed
                return true;
            } else {
                // Image file, perform compression
                const isImage = file.type.startsWith('image/png') || file.type.startsWith('image/jpeg');
                if (!isImage) {
                    message.error('You can only upload JPG, JPEG, and PNG files!');
                    return false;
                }

                const options = {
                    maxSizeMB: 0.1, // Maximum size in MB (100 KB)
                    maxWidthOrHeight: 1024, // Maximum width or height
                    useWebWorker: true // Use web workers for faster compression
                };

                try {
                    const compressedFile = await imageCompression(file, options);
                    // Check if the compressed file size is less than or equal to 100 KB
                    if (compressedFile.size / 1024 < 100) {
                        // Convert the compressed file back to Ant Design's format
                        const formattedFile = new File([compressedFile], compressedFile.name, {
                            type: compressedFile.type,
                            lastModified: Date.now()
                        });
                        return formattedFile;
                    } else {
                        // If compressed file size is greater than 100 KB, return false
                        return false;
                    }
                } catch (error) {
                    message.error('Failed to compress image!');
                    return false;
                }
            }
        },
        onChange(info: any) {
            // const extension = info.name.split('.').pop()?.toLowerCase();
            // if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) {
            setFileList(info.fileList);
            // } else {
            //     message.error('You can only upload JPG, JPEG, and PNG files!');
            // }
        },
        onDrop(e: any) { }
    };
    const handleCancel = () => {
        setModalVisible(false);
    };


    const handleSubmit = async () => {
        try {
            if (!documentType) {
                message.error('Please select document type.');
                setLoading(false); // Reset loading state
                return;
            }
            if (fileList.length <= 0) {
                message.error('Please upload at least one document.');
                setLoading(false); // Reset loading state
                return;
            }

            const formData = new FormData();

            if (fileList.length > 0) {
                const fileListWithBlob = fileList as { originFileObj: Blob }[];
                // Append each file to the FormData object
                fileListWithBlob.forEach((file, index) => {
                    formData.append(`images-${index + 1}`, file.originFileObj);
                });
            }

            formData.append('userId', user?._id as string);
            formData.append('documentType', documentType);

            setLoading(true);
            const res = await uploadIdentityDocuments(formData);

            if (res.status == true) {
                message.success(res.message);
                setModalVisible(false);
                setLoading(false);
                fetchDocuments();
                setmessage("")

            }
        } catch (error) {
            setLoading(false);
            ErrorHandler.showNotification(error);
        }
    };

    const handleUpload = () => {
        setModalVisible(true);
        setFileList([]);
    };

    const handleType = (value: string) => {
        setDocumentType(value);
    }

    const handleDelete = async (id: string) => {
        try {
            const data = {
                userId: user?._id,
                documentId: id
            };
            const res = await deleteUserDocument(data);
            if (res.status == true) {
                message.success(res.message);
                fetchDocuments();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    return (
        <>
            <ParaText size="large" fontWeightBold={600} color="primaryColor">
                Upload Identities
            </ParaText>
            <br />
            <Row>
                <Col md={20} xl={20} lg={20} sm={24} xs={24}>
                    <ParaText size="extraSmall" fontWeightBold={600} color="primaryColor">
                        Document Upload: Easily upload and manage your important documents to keep your profile information complete and up-to-date.
                    </ParaText>
                    <div className="smallTopMargin"></div>
                    <Row gutter={10}>
                        {userData ? (
                            <>
                                {userData.documents.map((document: any, index: any) => (
                                    <Col md={8} xl={8} lg={8} sm={24} xs={24} key={index}>
                                        <Card className="document-upload-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <span>
                                                        {document.type === 'selfie' ? 'Selfie' :
                                                            document.type === 'aadharFront' ? 'Valid Aadhaar Card (Front)' :
                                                                document.type === 'aadharBack' ? 'Valid Aadhaar Card (Back)' :
                                                                    document.type === 'voterFront' ? 'Valid Voter ID Card (Front)' :
                                                                        document.type === 'voterBack' ? 'Valid Voter ID Card (Back)' :
                                                                            'Other'}

                                                    </span>
                                                </div>
                                                <div>
                                                    <Popconfirm
                                                        title="Delete Notification"
                                                        description="Are you sure to delete this notification?"
                                                        onConfirm={async () => { handleDelete(document._id) }}
                                                        okText="Yes"
                                                        cancelText="No"
                                                    >
                                                        <Button danger ghost>
                                                            <FaTrash />
                                                        </Button>
                                                    </Popconfirm>
                                                </div>
                                            </div>
                                            <div className="smallTopMargin"></div>
                                            <Image
                                                width={'auto'}
                                                height={'auto'}
                                                alt={'document'}
                                                src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userDocuments/small/${document.imagePath}`}
                                                style={{ borderRadius: '10px' }}
                                            />
                                            <div className="smallTopMargin"></div>
                                        </Card>
                                    </Col>
                                ))}
                            </>
                        ) : 'no'}

                    </Row>
                    <div className="textEnd">
                        <Button type="primary" icon={<UploadOutlined />} onClick={handleUpload}>
                            Upload
                        </Button>
                    </div>
                </Col>
            </Row>
            <Modal
                title={<span style={{ fontSize: 'medium' }}>Upload Files</span>}
                visible={modalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Uploading' : 'Upload Identity'}
                    </Button>
                ]}
            >

                <>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ color: 'red' }}>*</span>
                        <p>{messages}</p>
                    </div>
                    <Select placeholder="Select document type" onChange={(value) => handleType(value)} style={{ width: '100%', height: '40px' }}>
                        <Select.Option value="selfie">Selfie</Select.Option>
                        <Select.Option value="aadharFront">Valid Aadhaar Card (Front)</Select.Option>
                        <Select.Option value="aadharBack">Valid Aadhaar Card (Back)</Select.Option>
                        <Select.Option value="voterFront">Valid Voter ID Card (Front)</Select.Option>
                        <Select.Option value="voterBack">Valid Voter ID Card (Back)</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    </Select>
                    <div className="smallTopMargin"></div>
                    <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibited from uploading
                            banned files.
                        </p>
                    </Dragger>
                </>

            </Modal>
        </>
    )
}
