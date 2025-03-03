import AuthContext from '@/contexts/AuthContext'
import { Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import FileInformation from '../../commonComponents/FileInformation';
import GetFiles from '../../commonComponents/GetFiles'

interface Props {
    activeKey: string;
    type: string;
}

export default function MyFiles({ activeKey, type }: Props) {
    const { user } = useContext(AuthContext);
    const [fileId, setFileId] = useState('');

    useEffect(() => {
        setFileId('');
    }, [user])

    return (
        <>
            <div id='favoriteFiles'>
                <Row gutter={16}>
                    <Col md={fileId ? 18 : 24}>
                        <GetFiles sorting={'alphaBetically'} userId={user?._id} fileType={undefined} activeKey={activeKey} onSelectedId={(id: any) => { setFileId(id) }} type={type} />
                    </Col>
                    {fileId &&
                        <Col md={6}>
                            <FileInformation fileId={fileId} folder={undefined} />
                        </Col>
                    }
                </Row>
            </div>
        </>
    )
}
