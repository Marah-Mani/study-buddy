import React from 'react'
import { Conversation } from '@chatscope/chat-ui-kit-react';
import Avatar from 'react-avatar';
import StringAvatar from '@/app/commonUl/StringAvatar';
import { getSender, getSenderFull } from '@/lib/chatLogics';

interface ConversationItemProps {
    key: string;
    chat: any;
    selectedChat: any;
    setSelectedChat: any;
    handleSelectChat: any;
    onlineUsers: any[];
    user: any;
}

export default function ConversationItem(
    {
        key,
        chat,
        selectedChat,
        setSelectedChat,
        handleSelectChat,
        onlineUsers,
        user
    }: ConversationItemProps,
) {
    return (
        <Conversation
            key={key}
            onClick={() => { setSelectedChat(chat); handleSelectChat(chat) }}
            active={selectedChat?._id === chat._id}
            unreadCnt={chat.unreadCount}
            lastActivityTime={
                <span
                    style={{ color: 'teal' }}
                >{onlineUsers?.some((userData: any) => userData.userId == getSenderFull(user, chat.users)._id) ? 'Online' : ''}
                </span>}
        >
            <Conversation.Content>
                <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>

                        {
                            chat.image ?
                                <Avatar
                                    name={chat.name}
                                    src={chat.image}
                                // status={onlineUsers.some((userData: any) => userData.userId == getSenderFull(user, chat.users)._id) ? 'available' : 'unavailable'}
                                />
                                :
                                <StringAvatar
                                    email={getSender(user, chat.users).email}
                                    key={`chat-${chat._id}`}
                                    name={chat &&
                                        !chat.isGroupChat ?
                                        getSender(user, chat.users) :
                                        chat.chatName}
                                    user={getSenderFull(user, chat.users)}
                                />
                        }
                    </div>
                    <div>
                        <p style={{ fontWeight: '500', textTransform: 'capitalize' }}>{!chat.isGroupChat
                            ? getSender(user, chat.users)
                            : chat.chatName}
                        </p>
                        <p style={{ fontSize: "12px", fontWeight: '400', color: '#000' }}>
                            {
                                user.block.includes(getSenderFull(user, chat.users)._id) ? (
                                    <p>You blocked this user.</p>
                                ) :
                                    !chat.isGroupChat
                                        ? getSender(user, chat.users)
                                        : chat.chatName}
                            {!user.block.includes(getSenderFull(user, chat.users)._id) && chat.latestMessage && ': ' + (chat.latestMessage.content.length > 50
                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                : chat.latestMessage.content)}
                        </p>
                    </div>
                </div>
            </Conversation.Content>
        </Conversation>
    )
}
