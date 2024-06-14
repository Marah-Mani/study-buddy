import { message } from 'antd';
import imageCompression from 'browser-image-compression';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { downloadZipFile } from './userApi';

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
const ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
const ALLOWED_FILE_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

export const handleFileCompression = async (file: File, type: any): Promise<UploadFile<any>[]> => {
    try {
        const fileList: UploadFile<any>[] = [];

        if (file) {
            let isValid;

            if (type === 'fileManager') {
                // Validate file type to prevent harmful files
                const extension = file.name.split('.').pop()?.toLowerCase();
                const mimeType = file.type.toLowerCase();

                isValid = extension && mimeType && (
                    ALLOWED_IMAGE_EXTENSIONS.includes(extension) ||
                    ALLOWED_FILE_EXTENSIONS.includes(extension) ||
                    ALLOWED_IMAGE_MIME_TYPES.includes(mimeType) ||
                    ALLOWED_FILE_MIME_TYPES.includes(mimeType)
                );

                if (isValid) {
                    const formattedFile: UploadFile<any> = {
                        uid: Date.now().toString(),
                        name: file.name,
                        status: 'done',
                        size: file.size,
                        type: file.type,
                        originFileObj: file as RcFile
                    };
                    fileList.push(formattedFile);
                } else {
                    message.error('Invalid file type. Uploading of harmful files is not allowed.');
                    return [];
                }
            } else {
                // Apply validation for other types
                const extension = file.name.split('.').pop()?.toLowerCase();
                const mimeType = file.type.toLowerCase();

                isValid = extension && ALLOWED_IMAGE_EXTENSIONS.includes(extension) && ALLOWED_IMAGE_MIME_TYPES.includes(mimeType);

                if (isValid) {
                    if (file.size / 1024 / 1024 <= 10) {
                        const options = {
                            maxSizeMB: 1,
                            maxWidthOrHeight: 1024,
                            useWebWorker: true
                        };
                        const compressedFile = await imageCompression(file, options);
                        const formattedFile: UploadFile<any> = {
                            uid: Date.now().toString(),
                            name: file.name,
                            status: 'done',
                            size: compressedFile.size,
                            type: compressedFile.type,
                            originFileObj: new File([compressedFile], file.name, { type: compressedFile.type }) as RcFile
                        };
                        fileList.push(formattedFile);
                    } else {
                        message.error('Image size cannot exceed 10 MB!');
                        return [];
                    }
                } else {
                    message.error('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
                    return [];
                }
            }
        }
        return fileList;
    } catch (error) {
        console.error('Error compressing image:', error);
        return [];
    }
};


export const downloadFolderInZipFile = async (folder: any) => {
    try {
        const blob = await downloadZipFile(folder._id);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        const zipName = `${folder.folderName}.zip`;
        link.setAttribute('download', zipName); // Specify the download filename
        document.body.appendChild(link);
        link.click();
        link.remove();
        message.success('Folder downloaded successfully!');
    } catch (error) {
        console.error('Error initiating download:', error);
        message.error('Error initiating download. Please try again.');
    }
};

