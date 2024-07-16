import ChatContext from '@/contexts/ChatContext';
import ErrorHandler from '@/lib/ErrorHandler';
import { ExpansionPanel } from '@chatscope/chat-ui-kit-react'
import { Input } from 'antd'
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
const { TextArea } = Input
import { CHAT } from '@/constants/API/chatApi';
import { API_BASE_URL } from '@/constants/ENV';
const baseURL = API_BASE_URL;
const { common } = CHAT;

export default function Note({ selectedChatCompare }: any) {
    const {
        user,
        config,
        selectedChat,
        chats, setChats,
        favourites,
        setFavourite,
        setSelectedChat
    }: any = useContext(ChatContext)
    const [stickyNote, setStickyNote] = useState('')
    const [stickyNoteId, setStickyNoteId] = useState('')

    useEffect(() => {
        if (selectedChat) {
            setStickyNote(selectedChat.stickyMessage?.message)
            setStickyNoteId(selectedChat.stickyMessage?._id)
        }
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    const storeStickyNote = async (value: string) => {
        try {
            const { data } = await axios.post(
                `${baseURL}${common.stickyNote}`,
                {
                    stickyNoteId: stickyNoteId,
                    userId: user._id,
                    chatId: selectedChat._id,
                    message: value
                },
                config
            );
            setStickyNoteId(data._id);

            const updatedChats = chats.map((chat: any) => {
                if (chat._id == selectedChat._id) {
                    return { ...chat, stickyMessage: data };
                } else {
                    return chat;
                }
            });

            const updatedFavChats = favourites.map((chat: any) => {
                if (chat._id == selectedChat._id) {
                    return { ...chat, stickyMessage: data };
                } else {
                    return chat;
                }
            });

            setChats(updatedChats);
            setFavourite(updatedFavChats);

            setSelectedChat({ ...selectedChat, stickyMessage: data });
        } catch (error) {
            new ErrorHandler(error);
        }
    };
    return (
        <ExpansionPanel
            title="Personal notes"
            open={true}
        >
            <TextArea rows={15} value={stickyNote} onChange={(e: any) => setStickyNote(e.target.value)} onBlur={(e: any) => storeStickyNote(e.target.value)} placeholder="This is personal note for this chat. This note is visible to you only." />
        </ExpansionPanel>
    )
}
