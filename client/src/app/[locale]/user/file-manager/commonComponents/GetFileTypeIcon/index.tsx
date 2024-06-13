// utils/getFileIcon.js
import React from 'react';
import { FcDocument, FcAudioFile, FcVideoFile, FcImageFile, FcFile } from 'react-icons/fc';
import { PiFileZipFill } from 'react-icons/pi';

interface Props {
    fileType: any;
    size: number;
}

const GetFileTypeIcon = ({ fileType, size }: Props) => {
    switch (fileType) {
        case 'audio/mpeg':
        case 'audio/mp3':
            return <FcAudioFile style={{ fontSize: `${size}` }} />;
        case 'video/mp4':
        case 'video/x-matroska':
            return <FcVideoFile style={{ fontSize: `${size}` }} />;
        case 'application/pdf':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return <FcDocument style={{ fontSize: `${size}` }} />;
        case 'application/zip':
            return <PiFileZipFill style={{ fontSize: `${size}`, color: '#90caf9' }} />;
        case 'image/png':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/webp':
            return <FcImageFile style={{ fontSize: `${size}` }} />;
        default:
            return <FcFile style={{ fontSize: `${size}` }} />;
    }
};

export default GetFileTypeIcon;
