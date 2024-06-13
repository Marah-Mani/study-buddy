
import React from 'react'
import Blog from '@/components/Blog'
import { getAllBlogs } from '@/lib/frontendApi';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
   return {
      title: `Blog | ${process.env.NEXT_APP_NAME}`,
      description: `${process.env.NEXT_APP_NAME}`,
      alternates: {
         canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`
      },
      openGraph: {
         title: `Blog | ${process.env.NEXT_APP_NAME}`,
         description: `${process.env.NEXT_APP_NAME}`,
         url: `${process.env.NEXT_PUBLIC_BASE_URL}/blogs`,
         siteName: `${process.env.NEXT_APP_NAME}`,
         images: [
            {
               url: `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo.png`,
               width: 350,
               height: 50
            }
         ],
         type: 'website'
      }
   };
}
export default async function page() {
   const blogs = await getAllBlogs();

   return (
      <>
         <Blog blogs={blogs} />
      </>
   )
}

