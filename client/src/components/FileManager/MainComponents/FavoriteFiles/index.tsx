import AuthContext from '@/contexts/AuthContext'
import { Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import FileInformation from '../../commonComponents/FileInformation';
import GetFiles from '../../commonComponents/GetFiles'

interface Props {
    activeKey: string;
}

export default function FavoriteFiles({ activeKey }: Props) {
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
                        <GetFiles userId={user?._id} fileType={undefined} activeKey={activeKey} onSelectedId={(id: any) => { setFileId(id) }} />
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
