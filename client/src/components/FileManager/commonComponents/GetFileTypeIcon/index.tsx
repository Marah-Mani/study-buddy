// utils/getFileIcon.js
import React from 'react';
import { FaRegFile, FaRegFileAudio, FaRegFileImage, FaRegFileVideo } from 'react-icons/fa6';
import { FcDocument, FcAudioFile, FcVideoFile, FcImageFile, FcFile } from 'react-icons/fc';
import { PiFileZipFill } from 'react-icons/pi';
import './style.css';

interface Props {
    fileType: any;
    size: number;
}

const GetFileTypeIcon = ({ fileType, size }: Props) => {

    switch (fileType) {
        case 'audio/mpeg':
        case 'audio/mp3':
            return (
                <div className='CustomClassForICon'>
                    <FaRegFileAudio style={{ fontSize: `${size}px` }} />
                </div>
            )
        case 'video/mp4':
        case 'video/x-matroska':
            return (
                <div className='CustomClassForICon'>
                    <FaRegFileVideo style={{ fontSize: `${size}px` }} />
                </div>
            )
        case 'application/pdf':
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            return (
                <div className='CustomClassForICon'>
                    <FaRegFile style={{ fontSize: `${size}px` }} />
                </div>
            )
        case 'application/zip':
            return (
                <div className='CustomClassForICon'>
                    <PiFileZipFill style={{ fontSize: `${size}px` }} />
                </div>
            )
        case 'image/png':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/webp':
            return (
                <div className='CustomClassForICon'>
                    <FaRegFileImage color='#f1a638' style={{ fontSize: `${size}px` }} />
                </div>
            )
        case 'Audio/Video':
            return (
                <div className='CustomClassForICon'>
                    <FaRegFileAudio style={{ fontSize: `${size}px` }} />
                </div>
            );
        case 'Document':
            return (
                <div className='CustomClassForICon'>
                    <FaRegFile style={{ fontSize: `${size}px` }} />
                </div>
            )
        case 'Image':
            return (
                <div className='CustomClassForICon'>
                    <FcImageFile style={{ fontSize: `${size}px` }} />
                </div>
            )
        case 'Zip':
            return (
                <div className='CustomClassForICon'>
                    <PiFileZipFill style={{ fontSize: `${size}px` }} />
                </div>
            )
        case 'Other':

        default:
            return (
                <div className='CustomClassForICon'>
                    <FaRegFile style={{ fontSize: `${size}px` }} />
                </div>
            )
    }
};

export default GetFileTypeIcon;
