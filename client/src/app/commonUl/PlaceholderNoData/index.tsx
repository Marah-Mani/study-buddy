import React from 'react';
import { Card, Col } from 'antd';

const PlaceholderNoData = ({ message }: any) => {
    return (
        <Col span={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <Card>
                <div style={{ textAlign: 'center', fontSize: '18px', color: '#999' }}>{message}</div>
            </Card>
        </Col>
    );
};

export default PlaceholderNoData;
