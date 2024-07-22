'use client'
import ParaText from '@/app/commonUl/ParaText'
import { Col, Input, Row, Space } from 'antd'
import React, { useState } from 'react'
import './style.css'
import TableData from './TableData'

export default function Page() {
    const [searchInput, setSearchInput] = useState<string>('');
    return (
        <>
            {/* <div className='gapMarginTopOne'></div> */}
            <div className="dashBody">
                <div className='gapMarginTopTwo'></div>
                <Row align='middle' gutter={[16, 16]}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} >
                        <ParaText size="large" fontWeightBold={600} color="primaryColor">
                            Users
                        </ParaText>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                        <Space>
                            <Input placeholder="Search" style={{ height: '38px', width: '100%', borderRadius: '30px' }} className='buttonClass' onChange={(e) => setSearchInput(e.target.value)} />
                        </Space>

                    </Col>
                </Row>
                <div className='gapMarginTopTwo'></div>
                <TableData reload={false} onEdit={undefined} searchInput={searchInput} />
            </div>
        </>
    )
}
