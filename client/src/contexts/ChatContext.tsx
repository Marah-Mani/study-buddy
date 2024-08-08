"use client"
interface ChatContextDefaults {
    user?: User | undefined;
    sender?: User | undefined;
    setSender: React.Dispatch<React.SetStateAction<User | undefined>>;
    chats?: any;
    setChats?: any;
    notification?: any;
    setNotification?: any;
    selectedChat?: any[] | undefined;
    setSelectedChat?: any;
    onlineUsers?: any;
    setOnlineUsers?: any;
    fetchAgain?: boolean;
    setFetchAgain: any;
    favourites?: any;
    setFavourite?: any;
    config?: any;
    setSelectedChatId?: any;
    selectedChatId?: any;
}

interface ChatContextProp {
    children?: React.ReactNode;
}

import { User } from "@/lib/types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import Cookies from "js-cookie";
import Loading from "@/app/commonUl/Loading";

const api = axios.create({
    baseURL: process.env['NEXT_PUBLIC_API_URL'] || ''
});


const ChatContext = createContext<ChatContextDefaults>({
    user: undefined,
    sender: undefined,
    setSender: () => { },
    chats: [],
    setChats: () => { },
    notification: undefined,
    setNotification: () => { },
    selectedChat: undefined,
    setSelectedChat: () => { },
    onlineUsers: [],
    setOnlineUsers: () => { },
    fetchAgain: false,
    setFetchAgain: () => { },
    favourites: [],
    setFavourite: () => { },
    config: null,
    setSelectedChatId: () => { },
    selectedChatId: undefined,
});

const ChatContentProvider = ({ children }: ChatContextProp) => {
    const { user } = useContext(AuthContext)
    const [sender, setSender] = useState<User | undefined>()
    const [chats, setChats] = useState<any[]>([])
    const [notification, setNotification] = useState<any>([])
    const [selectedChat, setSelectedChat] = useState<any>(undefined)
    const [onlineUsers, setOnlineUsers] = useState<any>([])
    const [fetchAgain, setFetchAgain] = useState(false)
    const [favourites, setFavourite] = useState<any>([])
    const [selectedChatId, setSelectedChatId] = useState<any>(undefined)
    const token = Cookies.get('session_token')
    const config = {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    if (!user) {
        return (
            <Loading />
        );
    }

    return (
        <ChatContext.Provider
            value={{
                user,
                sender,
                setSender,
                chats,
                setChats,
                notification,
                setNotification,
                selectedChat,
                setSelectedChat,
                onlineUsers,
                setOnlineUsers,
                fetchAgain,
                setFetchAgain,
                favourites,
                setFavourite,
                config,
                setSelectedChatId,
                selectedChatId,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContentProvider };
export default ChatContext;
