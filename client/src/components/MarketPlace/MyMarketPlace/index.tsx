'use client';
import React, { useContext, useState } from 'react';
import ParaText from '@/app/commonUl/ParaText';
import { Button, Col, Input, Row, Space } from 'antd';
import { Drawer } from 'antd';
import { getSingleProduct } from '@/lib/commonApi';
import TableData from '../TableData';
import FormType from '../FormType';
import AuthContext from '@/contexts/AuthContext';

interface Props {
    activeKey: any;
}
export default function MyMarketPlace({ activeKey }: Props) {
    const [open, setOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [editData, setEditData] = useState<any>([]);
    const [searchInput, setSearchInput] = useState('');
    const { user } = useContext(AuthContext);

    const showDrawer = () => {
        setOpen(true);
        setEditData({});

    };
    const onClose = () => {
        setOpen(false);
    };

    const handleSuccess = () => {
        setOpen(false);
        setReload(!reload);
    };

    const handleEdit = async (id: any) => {
        setOpen(true);
        const res = await getSingleProduct(id);
        if (res.status == true) {
            setEditData(res.data);
        }
    }

    return (
        <>
            <Row align='middle' gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} >
                    <ParaText size="small" fontWeightBold={600} color="primaryColor">
                        {user?.role == 'admin' ? 'Item List' : 'My Market Place'}
                    </ParaText>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                    <Space>
                        <Input allowClear placeholder="Search" style={{ height: '35px', width: '100%', borderRadius: '0' }} className='buttonClass' onChange={(e) => setSearchInput(e.target.value)} />
                        <Button style={{ height: '35px', width: '100%', borderRadius: '0' }} className='buttonClass' type='primary' onClick={showDrawer}>Add Product</Button>
                    </Space>

                </Col>
            </Row>
            <div className='gapMarginTopTwo'></div>
            <TableData searchInput={searchInput} reload={reload} onEdit={(id: any) => { handleEdit(id) }} />
            <Drawer title={editData ? 'Edit Item' : "Add Item"} onClose={onClose} open={open} width={600}>
                <FormType onSuccess={handleSuccess} editData={editData} />
            </Drawer>
        </>
    );
}
