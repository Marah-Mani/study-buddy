import { deleteUserFile } from '@/lib/commonApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Button, message, Popconfirm } from 'antd';
import React from 'react'
import { RiDeleteBin5Fill } from 'react-icons/ri';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface Props {
    userId: any;
    fileId: string;
    reload: any;
}
export default function CanDeleteFile({ userId, fileId, reload }: Props) {

    const handleDelete = async (userId: any, fileId: any) => {
        try {
            const data = {
                fileId: fileId,
                userId: userId,
            }
            const res = await deleteUserFile(data);
            if (res.status === true) {
                message.success(res.message);
                reload();
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    return (
        <>
            <div id='CanDeleteFile'>
                <Popconfirm
                    title="Delete file"
                    description="Are you sure to delete this file?"
                    icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    onConfirm={() => handleDelete(userId, fileId)}
                    okText="Yes"
                    cancelText="No"
                >
                    <span className='delete'>  <RiDeleteBin5Fill /></span>
                </Popconfirm>
            </div>
        </>
    )
}
