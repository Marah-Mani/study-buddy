export const CHAT = {
    chat: {
        upload: `/chat/upload`,
    },
    common: {
        fetchMessages: (selectedChatId: string) => `/common/message/${selectedChatId}`,
        sendMessage: `/common/message`,
        chatSeen: `/common/chat/seen`,
        deleteMessage: `/common/message/delete`,
        favoriteChat: `/common/chat/favourite`,
        clearChat: (selectedChatId: string) => `/common/chat/clear-chat/${selectedChatId}`,
        deleteChat: (selectedChatId: string) => `/common/chat/delete-chat/${selectedChatId}`,
        muteUnMute: `/common/chat/mute-unmute`,
        blockChat: `/common/chat/block`,
        continueChat: (selectedChatId: string) => `/common/chat/continue/${selectedChatId}`,
        messageDelete: `/common/message/delete`,
        bookMarkMessage: (id: string) => `/common/message/bookmark/${id}`,
        fetchChats: `/common/chat`,
        groupChat: `/common/chat/group`,
        searchChat: `/common/user?search=`,
        chatFiles: (chatId: string) => `/common/chat/files/${chatId}`,
        blockUser: (userId: string) => `/common/user/block/${userId}`,
        unBlockUser: `/common/chat/block`,
        stickyNote: `/common/chat/sticky-note`,
        deleteScheduledMessage: (id: string) => `/common/message/delete/${id}`,
        scheduledMessage: (chatId: string) => `/common/message/scheduled/${chatId}`,
        groupRemove: `/common/chat/groupremove`,
        updateUser: (userId: string) => `/common/user/update/${userId}`,
    }

}
