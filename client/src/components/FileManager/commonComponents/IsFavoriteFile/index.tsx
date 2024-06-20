'use client'
import { addOrRemoveFileToFavorite, checkIsFavoriteFile } from '@/lib/commonApi';
import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { IoMdStar, IoMdStarOutline } from 'react-icons/io';

interface Props {
    userId: any;
    fileId: string;
    isFavorite: boolean;
    onReload: any;
    activeKey: any;
}

export default function IsFavoriteFile({ userId, fileId, isFavorite, onReload, activeKey }: Props) {
    const [favorite, setFavorite] = useState(false);
    useEffect(() => {
        if (isFavorite == undefined) {
            checkFile(fileId);
        }
    }, [isFavorite])

    const checkFile = async (fileID: any) => {
        try {
            const data = {
                fileId: fileID,
                userId: userId,
            }
            const res = await checkIsFavoriteFile(data);
            if (res.status === true) {
                setFavorite(true);
            } else {
                setFavorite(false);
            }
        } catch (error) {
        }
    }

    const handleFavorite = async (userId: any, fileId: any, type: string) => {
        try {
            const data = {
                fileId: fileId,
                userId: userId,
                type: type,
            }
            const res = await addOrRemoveFileToFavorite(data);
            if (res.status === true) {
                message.success(res.message);
                if (activeKey == '3') {
                    onReload('favorites');
                } else {
                    onReload();
                }
            }
        } catch (error) {
        }
    }
    const checkFavorite = isFavorite == undefined ? favorite : isFavorite;
    return (
        <>
            <div id='isFavoriteFile'>
                {
                    checkFavorite ?
                        <span className='favorite' onClick={() => handleFavorite(userId, fileId, 'unFavorite')}><IoMdStar /></span>
                        :
                        <span className='favorite' onClick={() => handleFavorite(userId, fileId, 'favorite')}><IoMdStarOutline /></span>
                }
            </div>
        </>
    )
}
