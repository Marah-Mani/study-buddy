import React from 'react';
import './style.css'
import { Metadata, ResolvingMetadata } from 'next';

import { getSingleBlog } from '@/lib/frontendApi';
import SingleBlog from '@/components/single-blog';

type Props = {
   params: { slug: string };
};


export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
   const blog = await getSingleBlog(params.slug);

   return {
      title: blog.data.metaTitle ? blog.data.metaTitle : `blog | ${process.env.NEXT_APP_NAME}`,
      description: blog.data.metaDescription ? blog.data.metaDescription : `${process.env.NEXT_APP_NAME}`,
      alternates: {
         canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`
      },
      openGraph: {
         title: blog.data.metaTitle ? blog.data.metaTitle : `blog | ${process.env.NEXT_APP_NAME}`,
         description: blog.data.metaDescription ? blog.data.metaDescription : `${process.env.NEXT_APP_NAME}`,
         url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`,
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
   const res = await getSingleBlog(params.slug);


   return (
      <>
         <SingleBlog blogData={res.data} blogViewCount={res.blogView} />
      </>
   )
}
