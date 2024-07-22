import React from 'react'
import { ChatContentProvider } from '@/contexts/ChatContext'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

export default function ChatLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ChatContentProvider>
            <div className="userLayOut">{children}</div>
        </ChatContentProvider>
    )
}
