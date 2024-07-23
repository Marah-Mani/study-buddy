import React, { useContext } from 'react'
import { MenuProps, Popconfirm } from 'antd';
import { Dropdown, Space } from 'antd';
import { HiDotsVertical } from 'react-icons/hi';
import { QuestionCircleOutlined } from '@ant-design/icons';
import AuthContext from '@/contexts/AuthContext';

interface DropdownMenuProps {
    onUpdate: (updateInfo: { folder: any; action: any }) => void;
}

export default function DropdownMenu({ onUpdate }: any) {
    const { user } = useContext(AuthContext);

    const items: MenuProps['items'] = [
        {
            label: (<>
                <Popconfirm
                    title="Delete file"
                    description="Are you sure to delete this file?"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => onUpdate('delete')}
                    okText="Yes"
                    cancelText="No"
                >
                    <a href="" >Delete</a>
                </Popconfirm>
            </>),
            key: '0',
        },
        {
            label: <a href="" onClick={() => onUpdate('rename')}>Rename</a>,
            key: '1',
        },
        {
            label: <a href="" onClick={() => onUpdate('download')}>Download</a>,
            key: '2',
        },
    ];
    const filteredItems = items.filter((item: any) => {
        if (item.key === '0' || item.key === '1') {
            return user?.role !== 'user';
        }
        return true;
    });

    return (
        <>
            <Dropdown menu={{ items: filteredItems }} trigger={['click']} className='viewAll'>
                <a onClick={(e) => e.preventDefault()}>
                    <HiDotsVertical />
                </a>
            </Dropdown>
        </>
    )
}
