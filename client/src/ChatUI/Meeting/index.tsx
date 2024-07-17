import { ExpansionPanel } from '@chatscope/chat-ui-kit-react';
import { Button, List } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';
import dateFormat from 'dateformat';
import ChatContext from '@/contexts/ChatContext';
import { BiVideo } from 'react-icons/bi';

interface MeetingProps {
    meetings: any;
}

export default function Meeting({ meetings }: MeetingProps) {
    const { user }: any = useContext(ChatContext);

    return (
        <ExpansionPanel
            className='borderBottom'
            title="Meeting"
        >
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={meetings}
                renderItem={(item: any) => (
                    <List.Item
                        actions={[<Link
                            key="list-loadmore-more"
                            target='_blank'
                            href={item.senderId === user._id ? item.startUrl : item.joinUrl}>
                            <Button type='link'><BiVideo style={{ fontSize: '22px' }} /></Button>
                        </Link>]}
                    >
                        <List.Item.Meta
                            title={item.content}
                            description={dateFormat(item.meetingStartTime, "dd/mm/yyyy, h:MM tt")}
                        />

                    </List.Item>
                )}
            />
        </ExpansionPanel>
    )
}
