import React from 'react';
import { Modal, Button, Image, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ProfileModalProps {
    user: any;
    open: any;
    setOpen: any;
}

const ProfileModal = ({ user, open, setOpen }: ProfileModalProps) => {

    return (
        <>
            <Modal
                title={user.name}
                open={open}
                onCancel={() => setOpen(false)}
                centered
                footer={[
                    <Button key="close" onClick={() => setOpen(false)}>
                        Close
                    </Button>,
                ]}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Image
                        style={{ borderRadius: '50%' }}
                        width={150}
                        src={user.image}
                        alt={user.name}
                    />
                    <Text style={{ fontSize: '28px', fontFamily: 'Work sans' }}>Email: {user.email}</Text>
                </div>
            </Modal>
        </>
    );
};

export default ProfileModal;
