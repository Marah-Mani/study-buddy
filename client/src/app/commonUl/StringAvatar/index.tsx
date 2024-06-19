'use client'
import ChatContext from '@/contexts/ChatContext';
import React, { useContext } from 'react'
import Avatar from 'react-avatar';

interface StringAvatarProps {
    name: string;
    email?: string;
    key?: string | number;
    size?: string;
    round?: boolean;
    user?: any;
}

export default function StringAvatar({ name = '', email = '', key, size = '40px', round = true, user }: StringAvatarProps) {
    const { onlineUsers }: any = useContext(ChatContext)
    return (
        <div style={{ position: 'relative' }}>
            <Avatar key={key} name={name} email={email} size={size} round={round} />
            <div
                style={{
                    width: '13px',
                    height: '13px',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background:
                        onlineUsers && user && user?.chatStatus == 'default' ?
                            onlineUsers.some((userData: any) => userData.userId == user?._id) ?
                                'radial-gradient(circle at 3px 3px,#00d5a6,#00a27e)' :
                                'radial-gradient(circle at 3px 3px,#fffccc,#ffee00)' :
                            user?.chatStatus === "online" ?
                                'radial-gradient(circle at 3px 3px,#00d5a6,#00a27e)' :
                                'radial-gradient(circle at 3px 3px,#fffccc,#ffee00)',
                    borderRadius: '50px',
                    border: '2px solid #fff'
                }}></div>
        </div>

    )
}
