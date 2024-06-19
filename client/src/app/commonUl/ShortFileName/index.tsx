import React from 'react';

interface Props {
    fileName: string;
    short: number;
}

export default function ShortFileName({ fileName, short }: Props) {
    return (
        <>
            <p style={{ wordBreak: 'break-all', overflow: 'break-word' }}>{fileName.length > short ? fileName.slice(0, short) + '...' : fileName}</p>
        </>
    );
}
