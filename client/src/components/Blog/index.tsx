"use client"
import React, { useEffect } from 'react'
import './style.css'
import { Col, Image, Row } from 'antd'
import Link from 'next/link'
import { useState } from 'react'
import { getAllBlogs } from '@/lib/frontendApi'
import ErrorHandler from '@/lib/ErrorHandler'
import Titles from '@/app/commonUl/Titles'
import ParaText from '@/app/commonUl/ParaText'

interface BlogPost {
   key: string;
   name: string;
   age: number;
   address: string;
   tags: string[];
}
interface Props {
   blogs?: any;
}

export default function Blog({ blogs }: Props) {
   const [blogPosts, setBlogPosts] = useState([]);
   useEffect(() => {
      const fetchBlogs = async () => {
         try {
            const res = await getAllBlogs();
            if (res.status === true) {
               setBlogPosts(res.data.slice(0, 3));
            }
         } catch (error) {
            ErrorHandler.showNotification(error);
         }
      };
      fetchBlogs();
   }, []);

   return (
      <>
         <div className='gapMarginTop'></div>
         <div className="customContainer" id='blog'>
            <Titles level={3} color='black' className='textCenter'>Blogs</Titles>
            <div className='gapMarginTop'></div>
            <Row gutter={[16, 16]}>
               {blogs.data.map((item: any) => {
                  return (
                     <>
                        <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                           <div className='mainCard hover01'>
                              <Link href={`${process.env['NEXT_PUBLIC_SITE_URL']}/blog/${item.slug}`} passHref>
                                 <div className="card">
                                    <div className="card__header">
                                       <Image
                                          width='100%'
                                          preview={false}
                                          src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/blogs/original/${item.image}`}
                                          alt="card__image"
                                          className="card__image"
                                          fallback='/images/default.png'
                                       />

                                    </div>
                                    <div className="card__body">
                                       <span className="tag tag-blue">Boiler Plates</span>
                                       <Titles level={5} color='black'>{item.title.trim().slice(0, 50)}</Titles>
                                       <ParaText size="medium">
                                          {item.description ? (
                                             <div dangerouslySetInnerHTML={{ __html: item.description.trim().slice(0, 100) }}></div>
                                          ) : (
                                             'Loading...'
                                          )}
                                       </ParaText>

                                    </div>
                                    <div className="card__footer">
                                       <div className="user">
                                          <Image
                                             src={item.authorId?.profileImage ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/authors/original/${item.authorId?.profileImage}` : '/home/users.jpg'}
                                             alt="Profile"
                                             style={{ width: 50, height: 50, borderRadius: 30 }}
                                          />
                                          <div className="user__info">
                                             <h5>{item.authorId?.name}</h5>
                                             <small>{item.timeToRead}min. read</small>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </Link>
                           </div>
                        </Col>
                     </>
                  )
               })}

            </Row>
            <div className='gapMarginTop'></div>
         </div>
         <div className='gapMarginTop'></div>
      </>
   )
}
