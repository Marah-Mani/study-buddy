import React, { useContext, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import imageCompression from 'browser-image-compression';
import AuthContext from '@/contexts/AuthContext';
import { fileUpload } from '@/lib/commonApi';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';

const { Dragger } = Upload;

interface Props {
    handleCancelFile: () => void;
    folderId: any;
    getFilesWithId: any;
}

export default function FileUpload({ handleCancelFile, folderId, getFilesWithId }: Props) {
    const [fileList, setFileList] = useState<any>([]);
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleBeforeUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, 'fileManager');
            setFileList([...fileList, ...compressedFiles]);
            return false; // Prevent automatic upload by Ant Design
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        fileList,
        beforeUpload: handleBeforeUpload,
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        onRemove: (file) => {
            setFileList(fileList.filter((f: { uid: string; }) => f.uid !== file.uid));
        },
    };

    const handleUploadFile = async () => {
        setLoading(true);
        try {
            if (fileList.length <= 0) {
                message.error('Please upload at least one document.');
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('userId', user?._id as string);
            formData.append('folderId', folderId);

            fileList.forEach((file: any) => {
                formData.append('file', file.originFileObj);
            });

            const res = await fileUpload(formData);

            if (res.status === true) {
                message.success('File uploaded successfully.');
                handleCancelFile();
                setFileList([]);
                getFilesWithId();
            } else {
                message.error('Failed to upload files.');
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dragger {...uploadProps} style={fileList?.length >= 1 ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to this area to upload</p>
                <p className="ant-upload-hint">
                    You can upload a single file at once. Please avoid uploading company data or other restricted files.
                </p>
            </Dragger>

            <div className="smallTopMargin"></div>
            <Button key="submit" type="primary" loading={loading} disabled={loading || fileList.length === 0} onClick={handleUploadFile}>
                {loading ? 'Please wait, it will take a short time' : 'File Upload'}
            </Button>

        </>
    );
}
