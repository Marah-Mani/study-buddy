import React from 'react';
import { Avatar, List, Typography } from 'antd';

const { Text } = Typography;

const UserListItem = ({ handleFunction, user }: any) => {

    return (
        <List.Item
            onClick={handleFunction}
            style={{
                cursor: 'pointer',
                backgroundColor: '#E8E8E8',
                display: 'flex',
                alignItems: 'center',
                color: 'black',
                padding: '10px 15px',
                marginBottom: '10px',
                borderRadius: '8px',
                transition: 'background 0.3s, color 0.3s'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = '#38B2AC';
                e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = '#E8E8E8';
                e.currentTarget.style.color = 'black';
            }}
        >
            <Avatar
                src={user?.image}
                size="small"
                style={{ marginRight: '10px' }}
            >
                {user.name}
            </Avatar>
            <div>
                <Text>{user.name}</Text>
                <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                    <strong>Email: </strong>{user.email}
                </Text>
            </div>
        </List.Item>
    );
};

export default UserListItem;
