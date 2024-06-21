import React from 'react';

interface Props {
    fileName: string;
    short: number;
    onClick?: any
}

export default function ShortFileName({ fileName, short, onClick }: Props) {
    return (
        <>
            <p style={{ wordBreak: 'break-all', overflow: 'break-word' }} onClick={onClick}>{fileName.length > short ? fileName.slice(0, short) + '...' : fileName}</p>
        </>
    );
}
