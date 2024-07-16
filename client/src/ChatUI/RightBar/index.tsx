import React, { useContext } from 'react'
import { ExpansionPanel, MessageSeparator, Sidebar } from '@chatscope/chat-ui-kit-react'
import {
    Tooltip,
    Avatar as AntdAvatar,
    Space
} from 'antd';
import { FaRocketchat } from "react-icons/fa";
import { IoVideocamOutline } from "react-icons/io5";
import { MdCall } from "react-icons/md";
import StringAvatar from '@/app/commonUl/StringAvatar';
import { getSender, getSenderFull } from '@/lib/chatLogics';
import TimeAgo from 'react-timeago'
import moment from 'moment';
import SharedFile from '../SharedFile';
import Media from '../Media';
import ScheduledMessage from '../ScheduledMessage';
import Todo from '../Todo';
import Meeting from '../Meeting';
import BookmarkMessage from '../BookmarkMessage';
import Note from '../Note';
import './style.css'
import AuthContext from '@/contexts/AuthContext';
import { CloseOutlined } from '@ant-design/icons'

interface RightBarProps {
    selectedChat: any;
    user: any;
    onlineUsers: any;
    sendMessage?: any;
    viewInfo?: any;
    meetings?: any;
    messages?: any;
    selectedChatCompare?: any;
    onRefresh: any;
    onClose: any;
}

export default function Rightbar({ selectedChat, user, onlineUsers, sendMessage, viewInfo, meetings, messages, selectedChatCompare, onRefresh, onClose }: RightBarProps) {
    const { chatSettings } = useContext(AuthContext);

    const handleRefresh = () => {
        onRefresh()
    }
    return (
        <Sidebar position="right">
            <div>
                <div style={{ padding: '10px', cursor: 'pointer' }} onClick={onClose}>
                    <CloseOutlined />
                </div>
                <div
                    className="right-profile-box"
                    style={{
                        paddingTop: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: "100%",
                        flexDirection: 'column'
                    }}
                >
                    <div style={{ display: 'flex', gap: "10px", alignItems: 'center' }}>
                        {selectedChat &&
                            !selectedChat?.isGroupChat ?
                            <div style={{ position: 'relative' }}>
                                <StringAvatar
                                    email={getSender(user, selectedChat.users).email}
                                    key={`chat-${selectedChat._id}`}
                                    name={selectedChat && !selectedChat.isGroupChat ?
                                        getSender(user, selectedChat.users) :
                                        selectedChat.chatName}
                                />
                                <div
                                    style={{
                                        width: '13px',
                                        height: '13px',
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        background:
                                            onlineUsers.includes(getSenderFull(user, selectedChat.users)._id) ?
                                                'radial-gradient(circle at 3px 3px,#00d5a6,#00a27e)' :
                                                'radial-gradient(circle at 3px 3px,#fffccc,#ffee00)',
                                        borderRadius: '50px',
                                        border: '2px solid #fff'
                                    }}></div>
                            </div>
                            :
                            <AntdAvatar.Group
                                maxCount={2}
                                size="large"
                                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                            >
                                {selectedChat &&
                                    selectedChat.users.map((userData: any, index: number) => (
                                        <>
                                            <Tooltip
                                                color={'#fff'}
                                                placement="bottom"
                                                title={
                                                    <>
                                                        <p style={{ color: '#000' }}>{userData.name}</p>
                                                        <p style={{ color: '#000' }}>
                                                            {onlineUsers.some((onlineUser: any) => onlineUser.userId == userData._id)
                                                                ? 'Online'
                                                                : <TimeAgo date={getSenderFull(user, selectedChat.users)?.lastSeen} />
                                                            }
                                                        </p>
                                                        <p style={{ color: '#000' }}>Current time: {moment().tz(user.timeZone).format('hh:mm a')}</p>
                                                    </>
                                                }
                                                arrow={true}
                                                key={`group-user-${index}`}
                                            >
                                                <AntdAvatar style={{ backgroundColor: '#f56a00' }}>
                                                    {userData.name.toUpperCase().split(' ').map((part: any) => part[0]).join('')}
                                                </AntdAvatar>
                                            </Tooltip>

                                        </>
                                    ))
                                }
                            </AntdAvatar.Group>
                        }
                    </div>
                    <h4>{selectedChat && !selectedChat.isGroupChat
                        ? getSender(user, selectedChat.users)
                        : selectedChat?.chatName}</h4>
                    <p style={{ fontSize: ' 0.82rem' }}>{selectedChat && !selectedChat.isGroupChat && getSenderFull(user, selectedChat.users).email}</p>
                    <br />
                    <div>
                        <Space wrap>
                            <span className='iconCall'> <MdCall /></span>
                            <span className='iconCall'> <IoVideocamOutline /></span>
                            <span className='iconCall'> <FaRocketchat /></span>
                        </Space>
                    </div>

                </div>

                <div className="right-profile-box" style={{ marginBottom: '20px' }}></div>
                <MessageSeparator />
                <div className="right-profile-box" style={{ marginBottom: '20px' }}></div>
                {chatSettings?.showSharedFiles &&
                    <ExpansionPanel
                        title="Shared file"
                    >
                        <SharedFile />
                    </ExpansionPanel>
                }
                {chatSettings?.showPhotosAndMedia &&
                    <ExpansionPanel
                        title="Photos & Media"
                    >
                        <Media />
                    </ExpansionPanel>
                }
                {chatSettings?.showScheduledMessage &&
                    <ScheduledMessage
                        sendMessage={sendMessage}
                        viewInfo={viewInfo}
                    />
                }
                {chatSettings?.showBookmarkMessage &&
                    <BookmarkMessage
                        messages={messages}
                        user={user}
                        onReload={handleRefresh} />
                }
                {chatSettings?.showMeeting &&
                    <Meeting
                        meetings={meetings}
                    />
                }
                {chatSettings?.showTodo &&
                    <Todo />
                }
                {chatSettings?.showSticky &&
                    <Note
                        selectedChatCompare={selectedChatCompare}
                    />
                }

            </div>
        </Sidebar>
    )
}
