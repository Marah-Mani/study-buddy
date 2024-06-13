import React from 'react';

interface Props {
    fileType: string;
}

const GetFileTypeName = ({ fileType }: Props) => {
    const getFileTypeName = (type: string) => {
        const typeMap: { [key: string]: string } = {
            'application/x-httpd-php': 'PHP File',
            'application/x-php': 'PHP File',
            'application/pdf': 'PDF Document',
            'application/msword': 'Word Document',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
            'application/vnd.ms-excel': 'Excel Spreadsheet',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
            'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint Presentation',
            'application/zip': 'ZIP Archive',
            'image/png': 'PNG Image',
            'image/jpeg': 'JPEG Image',
            'image/jpg': 'JPG Image',
            'image/webp': 'WEBP Image',
            'audio/mpeg': 'MP3 Audio',
            'audio/mp3': 'MP3 Audio',
            'video/mp4': 'MP4 Video',
            'video/x-matroska': 'MKV Video',
            // Add more MIME types as needed
        };

        return typeMap[type] || 'Unknown File Type';
    };

    return (
        <>
            {getFileTypeName(fileType)}
        </>
    )
};

export default GetFileTypeName;
