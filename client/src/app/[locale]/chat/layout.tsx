import React from 'react'
import { ChatContentProvider } from '@/contexts/ChatContext'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import Header from '@/components/Header';
import TopBar from '@/app/commonUl/topBar';
import { Col, Row } from 'antd';
import MenuAdmin from '@/app/commonUl/MenuAdmin';

export default function ChatLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <ChatContentProvider>
            <section>
                <TopBar />
                <div className="largeTopMargin"></div>
                <Row gutter={[24, 24]} className="myRow">
                    <div className="largeTopMargin"></div>
                    <Col sm={24} xs={24} md={24} lg={24} xl={4} xxl={4} className="mobileNone">
                        <MenuAdmin />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={20} xxl={20}>
                        <>
                            <div className="layOutStyle">{children}</div>
                        </>
                    </Col>
                </Row>
            </section>
        </ChatContentProvider>
    )
}
