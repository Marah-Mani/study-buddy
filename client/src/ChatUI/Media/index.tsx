import ChatContext from '@/contexts/ChatContext';
import { Image } from 'antd';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';

const baseURL = API_BASE_URL;
const { common } = CHAT;

export default function Media() {
    const [files, setFiles] = useState<any>([]);
    const { config, selectedChat }: any = useContext(ChatContext);

    const chatFiles = async (chatId: string) => {
        const { data } = await axios.get(
            `${baseURL}${common.chatFiles(chatId)}`,
            config
        );
        setFiles(data);
    };

    useEffect(() => {
        if (selectedChat) {
            chatFiles(selectedChat._id);
        }
    }, [selectedChat, config]);

    return (
        <div
            className="right-profile-box"
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
            }}
        >
            {files.length > 0 &&
                files.map((file: any) => (
                    file.type === 'image/jpeg' && (
                        <div
                            key={file._id}
                            style={{
                                width: 'calc(33.33% - 10px)',
                                marginRight: '10px',
                                marginBottom: '10px',
                            }}
                        >
                            <Image
                                style={{ objectFit: 'cover' }}
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${file.path}`}
                                alt=""
                                height={100}
                            />
                        </div>
                    )
                ))}
        </div>
    );
}
