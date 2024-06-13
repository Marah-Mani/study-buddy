import React from 'react'

interface Props {
    fileSize: any;
}

export default function GetFileSize({ fileSize }: Props) {

    const formatSize = (size: number) => {
        if (size >= 1073741824) return `${(size / 1073741824).toFixed(2)} GB`;
        if (size >= 1048576) return `${(size / 1048576).toFixed(2)} MB`;
        if (size >= 1024) return `${(size / 1024).toFixed(2)} KB`;
        return `${size} B`;
    };

    return (
        <>
            {formatSize(fileSize)}
        </>
    )
}
