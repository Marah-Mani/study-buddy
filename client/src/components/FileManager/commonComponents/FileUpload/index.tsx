import React, { useContext } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import imageCompression from 'browser-image-compression';
import AuthContext from '@/contexts/AuthContext';
import { fileUpload } from '@/lib/commonApi';
import { handleFileCompression } from '@/lib/commonServices';
import ErrorHandler from '@/lib/ErrorHandler';

const { Dragger } = Upload;
interface props {
    handleCancelFile: () => void;
    folderId: any;
    getFilesWithId: any
}


export default function FileUpload({ handleCancelFile, folderId, getFilesWithId }: props) {

    const [fileList, setFileList] = React.useState<any>([]);
    const { user } = useContext(AuthContext);

    const handleBeforeUpload = async (file: File): Promise<boolean> => {
        try {
            const compressedFiles = await handleFileCompression(file, 'fileManager');
            setFileList(compressedFiles);
            return false;
        } catch (error) {
            ErrorHandler.showNotification(error);
            return true;
        }
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        fileList,
        disabled: fileList?.length == 1 ? true : false,
        accept: '.pdf,.png,.jpg,.jpeg',
        beforeUpload: handleBeforeUpload,
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleUploadFile = async () => {
        if (fileList.length <= 0) {
            message.error('Please upload at least one document.'); // Reset loading state
            return;
        }
        const formData = new FormData();
        formData.append('userId', user?._id as string);
        formData.append('folderId', folderId);
        if (fileList.length > 0) {
            const fileListWithBlob = fileList as { originFileObj: Blob }[];
            fileListWithBlob.forEach((file, index) => {
                formData.append('file', file.originFileObj);
            });
        }
        const res = await fileUpload(formData)
        if (res.status == true) {
            message.success('File uploaded successfully.')
            handleCancelFile()
            setFileList([])
            getFilesWithId()
        }
        return true
    }
    return (
        <>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
            <div className="smallTopMargin"></div>
            <Button key="submit" type="primary" onClick={handleUploadFile} >
                {/* {loading ? 'Uploading' : 'Upload Identity'} */}File upload
            </Button>
        </>
    )
}

