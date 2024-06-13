import React, { useContext } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import imageCompression from 'browser-image-compression';
import AuthContext from '@/contexts/AuthContext';
import { fileUpload } from '@/lib/userApi';

const { Dragger } = Upload;
interface props {
    handleCancelFile: () => void;
    folderId: any;
    getFilesWithId: any
}


export default function FileUpload({ handleCancelFile, folderId, getFilesWithId }: props) {
    console.log(folderId, "folderId ")
    const [fileList, setFileList] = React.useState<any>([]);
    const { user } = useContext(AuthContext);

    const props: UploadProps = {
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
        onChange(info) {
            setFileList(info.fileList);
            // console.log(info, 'here info data ???')
            // const { status } = info.file;
            // if (status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }
            // if (status === 'done') {
            //     message.success(`${info.file.name} file uploaded successfully.`);
            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            // }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const handleUploadFile = () => {
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
        const res = fileUpload(formData)
        handleCancelFile()
        getFilesWithId()
        message.success('File uploaded successfully.')
        setFileList([])
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
            <div className='gapMarginTop'></div>
            <Button key="submit" type="primary" onClick={handleUploadFile} >
                {/* {loading ? 'Uploading' : 'Upload Identity'} */}file upload
            </Button>
        </>
    )
}

