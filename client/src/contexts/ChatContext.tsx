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
}

interface ChatContextProp {
    children?: React.ReactNode;
}

import { User } from "@/lib/types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

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
    if (!user) {
        return 'Loading';
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
                setFavourite
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContentProvider };
export default ChatContext;
