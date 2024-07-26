import React, { useEffect, useRef } from 'react';
import 'emoji-picker-element';

// Define the custom event type
interface EmojiClickEvent extends CustomEvent {
    detail: {
        unicode: string;
    };
}

interface Props {
    onEmojiSelect: (emoji: string) => void;
}

const EmojiPicker = ({ onEmojiSelect }: Props) => {
    const pickerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const picker = pickerRef.current;

        if (picker) {
            const handleEmojiSelect = (event: EmojiClickEvent) => {
                const emoji = event.detail.unicode;
                onEmojiSelect(emoji);
            };

            picker.addEventListener('emoji-click', handleEmojiSelect as EventListener);

            return () => {
                picker.removeEventListener('emoji-click', handleEmojiSelect as EventListener);
            };
        }
        return
    }, [onEmojiSelect]);

    return <emoji-picker ref={pickerRef}></emoji-picker>;
};

export default EmojiPicker;
