import ParaText from '@/app/commonUl/ParaText';
import AuthContext from '@/contexts/AuthContext';
import { getAllChatSettings, updateChatSettings } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import { Col, Divider, message, Row, Switch } from 'antd';
import React, { useContext, useEffect, useState } from 'react'

interface Props {
    activeKey: any;
}

export default function ChatSetting({ activeKey }: Props) {
    const [chatSettings, setChatSetting] = useState([]);
    const [settingId, setSettingId] = useState('');
    const { setChatSettings } = useContext(AuthContext);

    useEffect(() => {
        getAllChatSettings().then((res) => {
            setChatSetting(res.data);
            setSettingId(res.data[0]._id);
        });
    }, [activeKey])

    const filteredKeys = ['_id', '__v'];

    function formatKeyName(key: any) {
        const words = key.split(/(?=[A-Z])/);

        const formattedKey = words.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        return formattedKey;
    };

    const handleSetting = async (value: any, key: any) => {
        try {
            const data = {
                _id: settingId,
                key,
                value
            }
            const res = await updateChatSettings(data);
            if (res.status === true) {
                message.success(res.message)
                setChatSettings(res.updatedData)
            } else {
                ErrorHandler.showNotification(res.message);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    return (
        <>
            <div className="smallTopMargin"></div>
            <ParaText size="large" fontWeightBold={600}
            // color="PrimaryColor"
            >
                Chat Settings
            </ParaText>
            <Row style={{ marginTop: '12px' }}>
                {Object.entries(chatSettings[0] || {})
                    .filter(([key]) => !filteredKeys.includes(key))
                    .map(([key, value]: any) => (
                        <Col sm={12} md={12} lg={12} xl={12} xxl={12} key={key} >
                            <Row >
                                <Col md={12}>
                                    <ParaText size="extraSmall" fontWeightBold={600}
                                    // color="PrimaryColor"
                                    >
                                        {formatKeyName(key)}
                                    </ParaText>
                                </Col>
                                <Col md={2}>
                                    <Switch
                                        checkedChildren="On"
                                        unCheckedChildren="Off"
                                        defaultChecked={value == true ? true : false}
                                        onChange={(checked) => handleSetting(checked, key)}
                                    />
                                </Col>
                                <Divider />
                            </Row>


                        </Col>
                    ))}
            </Row>
        </>
    )
}
