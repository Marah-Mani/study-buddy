import React from 'react'
import './style.css'
import type { CollapseProps } from 'antd';
import { Col, Collapse, Row } from 'antd';
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
const { Panel } = Collapse;
export default function FaqSection() {
    const CustomExpandIcon = ({ isActive }): any => (
        isActive ? <MinusOutlined /> : <PlusOutlined />
    );
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: 'User-Friendly Interface',
            children: <ParaText size="extraSmall" color="black"> Easy to navigate and use, even for those who are not tech-savvy.</ParaText>,
        },
        {
            key: '2',
            label: 'Secure and Private',
            children: <ParaText size="extraSmall" color="black">Your data is safe with us. We prioritize your privacy and security.</ParaText>,
        },
        {
            key: '3',
            label: 'Community Driven',
            children: <ParaText size="extraSmall" color="black">Built by students, for students. Join a vibrant community that understands your needs.</ParaText>,
        },
        {
            key: '4',
            label: 'All-In-One Solution',
            children: <ParaText size="extraSmall" color="black">No need to juggle multiple apps and platforms. StudyBuddy brings everything you need under o</ParaText>,
        },
    ];
    return (
        <>
            <div className='faq-accordion-container'>
                <div className='customContainer'>

                    <Row gutter={[16, 16]}>
                        <Col lg={12}> </Col>
                        <Col lg={12}>
                            <div className=''>
                                <Titles color='white' level={2}>Why Choose StudyBuddy</Titles>
                            </div>
                            <br />
                            <div className='gapMarginTopTwo'></div>
                            <Collapse accordion items={items} expandIconPosition="end" expandIcon={({ isActive }) => <CustomExpandIcon isActive={isActive} />} />
                        </Col>
                    </Row >
                </div >
            </div>

        </>
    )
}
