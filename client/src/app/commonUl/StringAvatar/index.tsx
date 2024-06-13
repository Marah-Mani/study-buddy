'use client'
import React from 'react'
import Avatar from 'react-avatar';

interface StringAvatarProps {
    name: string;
    email?: string;
    key?: string | number;
    size?: string;
    round?: boolean;
}

export default function StringAvatar({ name = '', email = '', key, size = '40px', round = true }: StringAvatarProps) {
    return (
        <Avatar key={key} name={name} email={email} size={size} round={round} />
    )
}
