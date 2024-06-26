import React, { useContext } from 'react'
import axios from 'axios'
import { Button, Flex, Form, FormProps, Input, Select, message } from 'antd'
import { User } from '@/lib/types'
import AuthContext from '@/contexts/AuthContext';

interface MyAccountProps {
    config?: any;
    user?: any;
}

export default function MyAccount({ config, user }: MyAccountProps) {
    const { setUser } = useContext(AuthContext)
    const onFinish: FormProps<User>['onFinish'] = async (values) => {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/common/user/update/${user._id}`, values, config);
        setUser(data.data)
        message.success('Saved.')
    }
    return (
        <Form layout='horizontal' initialValues={user} onFinish={onFinish}>
            <label>Name:</label>
            <Form.Item name={'name'}>
                <Input />
            </Form.Item>
            <label>Status:</label>
            <Form.Item name={'chatStatus'}>
                <Select options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Always online', value: 'online' },
                    { label: 'Always offline', value: 'offline' }
                ]}
                />
            </Form.Item>
            <Flex justify='flex-end' gap={20} align='center'>
                <Button htmlType='submit' type='primary' >
                    Submit
                </Button>
            </Flex>
        </Form>
    )
}
