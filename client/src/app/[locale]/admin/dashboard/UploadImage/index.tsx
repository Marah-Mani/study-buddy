import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadProps, RcFile, UploadFile } from 'antd/es/upload';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';

const { Dragger } = Upload;

interface Props {
    fileList: (files: UploadFile<any>[]) => void;
}

export default function FileUpload({ fileList }: Props) {
    const [internalFileList, setInternalFileList] = useState<UploadFile<any>[]>([]);

    const handleBeforeUpload = async (file: RcFile): Promise<boolean> => {
        try {
            if (internalFileList.length >= 3) {
                message.error('You can only upload up to 3 images');
                return false; // Prevent upload
            }

            const compressedFiles = await handleFileCompression(file, '');
            setInternalFileList(prevFileList => {
                const newFileList = [...prevFileList, ...compressedFiles];
                fileList(newFileList); // Pass the accumulated files to the parent component
                return newFileList;
            });
            return false; // Prevent default upload behavior
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true; // Allow upload if there was an error
        }
    };

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        accept: '.png,.jpg,.jpeg',
        disabled: internalFileList.length >= 3,
        beforeUpload: handleBeforeUpload,
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
            </p>
        </Dragger>
    );
}
