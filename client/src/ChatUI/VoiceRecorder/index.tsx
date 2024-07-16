import React, { useState } from 'react';
import { ReactMic } from 'react-mic';
import { MdKeyboardVoice, MdClose } from 'react-icons/md';
import { Tooltip } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface VoiceRecorderProps {
    onSendVoiceMessage: (voiceBlob: Blob) => void; // Callback function to send the recorded voice message
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendVoiceMessage }) => {
    const [record, setRecord] = useState(false);
    const [voiceMessage, setVoiceMessage] = useState<any>(null);
    const [playing, setPlaying] = useState(false);

    const startRecording = () => {
        setRecord(true);
    };

    const stopRecording = () => {
        setRecord(false);
    };

    const onData = () => {
    };

    const onStop = (recordedBlob: any) => {
        setVoiceMessage(recordedBlob);
    };


    const handleSendVoiceMessage = () => {
        if (voiceMessage && voiceMessage.blob) {
            onSendVoiceMessage(voiceMessage.blob);
            setVoiceMessage(null);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {!record && !playing ? (
                <button onClick={startRecording} type="button" style={{ background: 'none', border: 'none' }}>
                    <MdKeyboardVoice style={{ cursor: 'pointer', fontSize: '24px' }} />
                </button>
            ) : (
                <button onClick={stopRecording} type="button" style={{ background: 'none', border: 'none' }}>
                    <MdClose style={{ cursor: 'pointer', fontSize: '24px' }} />
                </button>
            )}
            <Tooltip
                title={record ? 'Stop Recording' : 'Start Recording'}
            >
                <ReactMic
                    record={record}
                    className="sound-wave"
                    onStop={onStop}
                    onData={onData}
                    noiseSuppression={true}
                    visualSetting={'sinewave'}
                    strokeColor="#000000"
                    backgroundColor="#ccc"
                />
            </Tooltip>
            {voiceMessage && (
                <div>
                    <SendOutlined style={{ cursor: 'pointer', fontSize: '20px' }} onClick={handleSendVoiceMessage} />
                </div>
            )}
        </div>
    );
};

export default VoiceRecorder;
