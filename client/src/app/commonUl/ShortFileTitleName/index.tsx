import React from 'react';

interface Props {
    fileName: string;
    short: number;
    onClick?: any
}

export default function ShortFileTitleName({ fileName, short, onClick }: Props) {
    return (
        <>
            <span style={{ wordBreak: 'break-all', overflow: 'break-word', fontWeight: '600' }} onClick={onClick}>{fileName.length > short ? fileName.slice(0, short) + '...' : fileName}</span>
        </>
    );
}
