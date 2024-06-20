import React from 'react'
import { Conversation } from '@chatscope/chat-ui-kit-react';
import Avatar from 'react-avatar';
import StringAvatar from '@/app/commonUl/StringAvatar';
import { getSender, getSenderFull } from '@/lib/chatLogics';
import { BiVideo } from 'react-icons/bi';
import { Button, Flex } from 'antd';
import dateFormat from "dateformat";

interface MeetingItemProps {
    key: string;
    chat: any;
    selectedChat: any;
    setSelectedChat: any;
    handleSelectChat: any;
    onlineUsers: any[];
    user: any;
    meeting: any;
}

export default function MeetingItem(
    {
        key,
        chat,
        selectedChat,
        setSelectedChat,
        handleSelectChat,
        onlineUsers,
        user,
        meeting
    }: MeetingItemProps,
) {
    return (
        <Conversation
            key={key}
            onClick={() => { setSelectedChat(chat); handleSelectChat(chat) }}
            lastActivityTime={
                <span
                    style={{ color: 'teal' }}
                >{onlineUsers.some((userData: any) => userData.userId == getSenderFull(user, chat.users)._id) ? 'Online' : ''}
                </span>}
        >
            <Conversation.Content>
                <Flex justify='space-between' align='center'>
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
                            <p style={{ fontWeight: '500', textTransform: 'capitalize' }} title={meeting.content}>
                                {
                                    user.block.includes(getSenderFull(user, chat.users)._id) ? (
                                        <p>You blocked this user.</p>
                                    ) :
                                        ''
                                }
                                {!user.block.includes(getSenderFull(user, chat.users)._id) && meeting.content && (meeting.content.length > 50
                                    ? meeting.content.substring(0, 20) + "..."
                                    : meeting.content)}
                            </p>
                            <p style={{ fontSize: "12px", fontWeight: '400', color: 'rgba(0,0,0,.6)' }}>
                                {!chat.isGroupChat
                                    ? getSender(user, chat.users)
                                    : chat.chatName} : {dateFormat(meeting.meetingStartTime, 'mm-dd-yy, h:MM TT')}
                            </p>
                        </div>
                    </div>
                    <Button type='link' style={{ padding: 0, margin: 0 }}>
                        <BiVideo style={{ fontSize: '25px' }} />
                    </Button>
                </Flex>
            </Conversation.Content>
        </Conversation>
    )
}
