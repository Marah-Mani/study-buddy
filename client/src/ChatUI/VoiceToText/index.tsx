import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { AudioFilled } from '@ant-design/icons';
import './style.css';
import { Tooltip } from 'antd';

interface Props {
    onSetMessage: any;
    selectedChat: any;
}

export default function VoiceToText({ onSetMessage, selectedChat }: Props) {
    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    // Log transcript to console whenever it changes
    useEffect(() => {
        if (transcript !== '') {
            onSetMessage(transcript);
        }
    }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn&apos;t support speech recognition.</span>;
    }

    const handleStart = () => {
        SpeechRecognition.startListening(); // Start listening
    }

    const handleStop = () => {
        if (listening) {
            SpeechRecognition.stopListening(); // Stop listening only if currently listening
        }
    }

    return (
        <div>
            <div className={listening ? 'voiceButton' : ''}>
                <div className={listening ? 'pulse-ring' : ''}></div>
                <Tooltip
                    title={'Speak to text message'}
                >
                    <AudioFilled style={{ cursor: 'pointer', fontSize: '19px', color: selectedChat.isApproved ? '#6ea9d7' : '#ccc' }} onClick={selectedChat.isApproved ? listening ? handleStop : handleStart : () => { }} />
                </Tooltip>
            </div>
        </div>
    );
};


