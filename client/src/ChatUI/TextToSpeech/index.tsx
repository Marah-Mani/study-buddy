import React from "react";
import { MdOutlineVolumeUp } from "react-icons/md";
import Speech from "react-text-to-speech";

interface Props {
    text: string;
    onPause?: () => void;
    onResume?: () => void;
    onSpeakStart?: () => void;
    onSpeakEnd?: () => void;
    voice?: string;
    pitch?: number;
    rate?: number;
    volume?: number;
    lang?: string;
}

export default function TextToSpeech({
    text
}: Props) {
    return (
        <Speech
            text={text}
            startBtn={(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <MdOutlineVolumeUp style={{ marginRight: '8px' }} /> Listen
                </div>
            )}
            rate={1}
            pitch={1}
            stopBtn=''
            pauseBtn={''}
        />
    );
}
