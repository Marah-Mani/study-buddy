'use client'
import ParaText from '@/app/commonUl/ParaText';
import Titles from '@/app/commonUl/Titles';
import { getSingleKnowledgeBase } from '@/lib/frontendApi';
import React, { useEffect, useState } from 'react';
import { YoutubeOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function Page({ params }: { params: { id: string } }) {
    const [document, setDocument] = useState<any>();
    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const res = await getSingleKnowledgeBase(params.id)
        setDocument(res.data)
    }

    return (
        <>
            <div className="largeTopMargin"></div>
            <Titles level={4} color='black' className='textCenter'>{document?.title}</Titles>
            <div className="smallTopMargin"></div>
            <ParaText
                size='large'
                fontWeightBold={500}
                color='black'
            >
                {document?.category}
            </ParaText>
            <Link href={`${document?.youtubeLink}`} type="link" target='_blank' style={{ textDecoration: 'none' }}>
                <YoutubeOutlined style={{ color: 'red' }} /> Youtube
            </Link >
            <div dangerouslySetInnerHTML={{ __html: document?.description }}></div>
        </>
    )
}
