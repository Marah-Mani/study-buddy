import React from 'react';
import { Card, Avatar, Tag, Row, Col, Space } from 'antd';
import { EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons';

const { Meta } = Card;

const TaskCard = ({ allTask }: any) => {
    return (
        <Row gutter={[16, 16]}>
            {allTask.map((task: any) => (
                <Col key={task.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        style={{ borderRadius: '8px', borderLeft: '4px solid #1890ff', marginBottom: '16px' }}
                    >
                        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
                            <Col>
                                <StarOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
                            </Col>
                            <Col>
                                <Space>
                                    <EditOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
                                    <DeleteOutlined style={{ fontSize: '16px', cursor: 'pointer' }} />
                                </Space>
                            </Col>
                        </Row>
                        <Meta
                            title={task.title}
                            description={
                                <div>
                                    <Row style={{ marginBottom: '8px' }}>
                                        <Col span={24}>
                                            <div>Assigned On: {new Date(task.assignedDate).toLocaleDateString()}</div>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: '8px' }}>
                                        <Col span={24}>
                                            <div>Target Date: {new Date(task.targetDate).toLocaleDateString()}</div>
                                        </Col>
                                    </Row>
                                    <Row style={{ marginBottom: '8px' }}>
                                        <Col span={6}>
                                            <div>Assigned To:</div>
                                        </Col>
                                        <Col span={14}>
                                            <Avatar.Group maxCount={3}>
                                                <Avatar src="https://randomuser.me/api/portraits/women/1.jpg" />
                                                <Avatar src="https://randomuser.me/api/portraits/men/2.jpg" />
                                                <Avatar src="https://randomuser.me/api/portraits/women/3.jpg" />
                                                <Avatar src="https://randomuser.me/api/portraits/men/4.jpg" />
                                            </Avatar.Group>
                                        </Col>
                                        {/* <Col span={14}>
                                            <Avatar.Group maxCount={3}>
                                                {task.assignedTo.map((avatar: any, index: any) => (
                                                    <Avatar key={index} src={avatar} />
                                                ))}
                                            </Avatar.Group>
                                        </Col> */}
                                        <Col span={4}>
                                            <Tag color="red">{task.priority}</Tag>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default TaskCard;
