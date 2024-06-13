import React from 'react'
import { Metadata, ResolvingMetadata } from 'next';
import { getSingleForum } from '@/lib/frontendApi';
import SingleForum from '@/components/Forums/SingleForum';

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const forum = await getSingleForum(params.slug);

    return {
        title: forum.data.metaTitle ? forum.data.metaTitle : `forum | ${process.env.NEXT_APP_NAME}`,
        description: forum.data.metaDescription ? forum.data.metaDescription : `${process.env.NEXT_APP_NAME}`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/questions/${params.slug}`
        },
        openGraph: {
            title: forum.data.metaTitle ? forum.data.metaTitle : `forum | ${process.env.NEXT_APP_NAME}`,
            description: forum.data.metaDescription ? forum.data.metaDescription : `${process.env.NEXT_APP_NAME}`,
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/forum/${params.slug}`,
            siteName: `${process.env.NEXT_APP_NAME}`,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/innerLogo.png`,
                    width: 350,
                    height: 50
                }
            ],
            type: 'website'
        }
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const res = await getSingleForum(params.slug);
    return (
        <>
            <SingleForum forumData={res.data} />
        </>
    )
}
