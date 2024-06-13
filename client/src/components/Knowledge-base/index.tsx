import React from 'react'

interface Props {
    singleData: any
}

export default function SingleKnowledgeBase({ singleData }: Props) {
    return (
        <div>{singleData.title}</div>
    )
}
