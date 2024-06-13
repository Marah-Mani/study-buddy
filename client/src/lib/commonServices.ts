import { message } from 'antd';
import imageCompression from 'browser-image-compression';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { downloadZipFile } from './userApi';

export const handleFileCompression = async (file: File): Promise<UploadFile<any>[]> => {
    try {
        const fileList: UploadFile<any>[] = [];
        if (file) {
            // Check file extension
            const extension = file.name.split('.').pop()?.toLowerCase();
            if (extension && ['jpg', 'jpeg', 'png'].includes(extension)) {
                // Check if file size is less than or equal to 10 MB
                if (file.size / 1024 / 1024 <= 10) {
                    const options = {
                        maxSizeMB: 1, // Maximum size in MB
                        maxWidthOrHeight: 1024, // Maximum width or height
                        useWebWorker: true // Use web workers for faster compression
                    };

                    const compressedFile = await imageCompression(file, options);

                    // Create a compatible object with the necessary properties
                    const formattedFile: UploadFile<any> = {
                        uid: Date.now().toString(), // Generate a unique UID
                        name: file.name, // Preserve the original file name
                        status: 'done', // Set the status as 'done' since the file is ready for upload
                        size: compressedFile.size, // Set the size of the file
                        type: compressedFile.type, // Set the type of the file
                        originFileObj: new File([compressedFile], file.name, { type: compressedFile.type }) as RcFile // Set the original file object with the proper type
                    };

                    // Add the formatted compressed file to the fileList array
                    fileList.push(formattedFile);
                } else {
                    // Show a notification message to the user
                    message.error('Image size cannot exceed 10 MB!');
                }
            } else {
                // Show a notification message to the user for invalid file type
                message.error('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
            }
        }
        return fileList;
    } catch (error) {
        console.error('Error compressing image:', error);
        // Handle the error without displaying any messages (optional)
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

