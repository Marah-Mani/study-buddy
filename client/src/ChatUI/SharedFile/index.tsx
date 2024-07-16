import React, { useContext, useEffect, useState } from 'react'
import {
    Button
} from 'antd';
import ChatContext from '@/contexts/ChatContext';
import { GrDocumentCsv } from 'react-icons/gr';
import { BiDownload } from 'react-icons/bi';
import Link from 'next/link';
import axios from 'axios';
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';
const baseURL = API_BASE_URL;
const { common } = CHAT;

export default function SharedFile() {
    const [files, setFiles] = useState<any>([])
    const { config, selectedChat }: any = useContext(ChatContext)

    const chatFiles = async (chatId: string) => {
        const { data } = await axios.get(
            `${baseURL}${common.chatFiles(chatId)}`,
            config
        );
        setFiles(data)
    }
    useEffect(() => {
        selectedChat && chatFiles(selectedChat._id)
    }, [selectedChat, config])

    return (
        <div className="right-profile-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
            {
                files.length > 0 &&
                files.map((file: any) => (
                    file.type != 'image/jpeg' &&
                    <>
                        <div style={{ display: 'flex', gap: '10px', width: "100%" }}>
                            <Button icon={<GrDocumentCsv />} />
                            <span>
                                <h5>{file?.name}</h5>
                                <p style={{ fontSize: '12px' }}>24 oct 2024 - 14:32 </p>
                            </span>
                        </div>
                        <Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${file.path}`} target='_blank'>
                            <Button icon={<BiDownload />} />
                        </Link>
                    </>
                ))
            }
        </div>
    )
}
