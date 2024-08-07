import React, { useContext, useEffect, useState } from 'react'
import {
    Button, Col, Row
} from 'antd';
import ChatContext from '@/contexts/ChatContext';
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
        <div className="right-profile-box" style={{ width: "100%" }}>
            <Row gutter={[10, 10]}>
                {
                    files.length > 0 &&
                    files
                        .filter((file: any) => file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png')
                        .map((file: any) => (
                            <>
                                <Col md={24}>
                                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                        <Link href={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${file.path}`} target='_blank'>
                                            <Button icon={<BiDownload />} />
                                        </Link>
                                        <span>
                                            <h5>{file?.name}</h5>
                                            <p style={{ fontSize: '12px' }}>24 Oct 2024 - 14:32</p>
                                        </span>
                                    </div>
                                </Col>
                            </>
                        ))
                }
            </Row >
        </div >
    )
}
