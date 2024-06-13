import React from 'react';
import { Tag, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const UserBadgeItem = ({ user, handleFunction, admin }: any) => {
    return (
        <Tag
            color="purple"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: '8px',
                padding: '0 8px',
                cursor: 'pointer',
                margin: '4px 4px 8px 0',
                fontSize: '12px',
            }}
            onClick={handleFunction}
        >
            <span>{user.name}</span>
            {admin === user._id && <span> (Admin)</span>}
            <Tooltip title="Remove">
                <CloseOutlined style={{ marginLeft: '8px' }} />
            </Tooltip>
        </Tag>
    );
};

export default UserBadgeItem;
