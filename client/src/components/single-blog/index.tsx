"use client"
import React, { useContext, useEffect, useState } from 'react';
import { FaBookmark, FaUser, FaComments, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { GrInstagram } from "react-icons/gr";
import { Row, Col, Image } from 'antd';
import './style.css'
import Link from 'next/link';
import ErrorHandler from '@/lib/ErrorHandler';
import { blogViews, getAllBlogs } from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';

interface BlogPost {
   key: string;
   name: string;
   age: number;
   address: string;
   tags: string[];
}

interface Props {
   blogData?: any;
   blogViewCount?: any;
}
export default function SingleBlog({ blogData, blogViewCount }: Props) {
   const [blogPosts, setBlogPosts] = useState([]);
   const { user } = useContext(AuthContext);
   const [viewsData, setViewsData] = useState([]);

   useEffect(() => {
      const fetchBlogs = async () => {
         try {
            const res = await getAllBlogs();
            if (res.status === true) {
               setBlogPosts(res.data);
            }
         } catch (error) {
            ErrorHandler.showNotification(error);
         }
      };
      fetchBlogs();
   }, [user]);

   useEffect(() => {
      const timeout = setTimeout(() => {
         fetchViewsData();
      }, 5000);

      return () => clearTimeout(timeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);


   const shuffledBlogPosts = [...blogPosts].sort(() => Math.random() - 0.5);
   const randomThreeBlogPosts = shuffledBlogPosts.slice(0, 3);

   const fetchViewsData = async () => {
      try {
         const response = await fetch('http://ip-api.com/json?fields=status,message,country,district,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,query');
         const data = await response.json();
         const browserName = getBrowserName(navigator.userAgent);
         const operatingSystem = navigator.platform;
         const deviceName = getDeviceName(navigator.userAgent);

         const viewsData = {
            ...data,
            blogId: blogData?._id,
            browserName: browserName,
            operatingSystem: operatingSystem,
            deviceName: deviceName
         };

         setViewsData(viewsData);
         await blogViews(viewsData);
      } catch (error) {
         console.error('Error fetching user IP:', error);
      }
   };


   const getDeviceName = (userAgent: string): string => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const isTablet = /iPad/i.test(userAgent);
      const isDesktop = !isMobile && !isTablet;

      if (isMobile) {
         return 'Mobile';
      } else if (isTablet) {
         return 'Tablet';
      } else if (isDesktop) {
         return 'Desktop';
      } else {
         return 'unknown';
      }
   };

   const getBrowserName = (userAgent: string): string => {
      const match = userAgent.match(/(chrome|firefox|safari|edge|msie|trident(?=\/))\/?\s*(\d+)/i);
      if (match && match[1]) {
         return match[1].toLowerCase();
      } else {
         return 'unknown';
      }
   };

   return (
      <>
         <div className='customContainer' id='blogSingleId'>
            <Titles level={2} color='black' className='textCenter'>Blog Details</Titles>
            <div className='blogSingle'>
               <Link href="#">
                  <Image width={1290} preview={false} src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/blogs/original/${blogData?.image}`}
                     alt="blog" className="card__image" />
               </Link>
               <div className='gapMarginTop'></div>
               <div className="blogMeta">
                  <span className="tag1"> <FaUser /> <Link href="#">{blogData?.authorId?.name}</Link>

                  </span>
                  <ul className="socialShare">
                     <li><Link className="shareFacebook" href={blogData?.authorId?.facebook ?? '#'}><FaFacebookF /> </Link></li>
                     <li><Link className="shareTwitter" href={blogData?.authorId?.twitter ?? '#'}> <FaTwitter /> </Link></li>
                     <li><Link className="sharePinterest" href={blogData?.authorId?.instagram ?? '#'}> <GrInstagram /> </Link></li>
                     <li><Link className="sharePinterest" href={blogData?.authorId?.linkedin ?? '#'}> <FaLinkedin />  </Link></li>
                  </ul>
                  <span className="tag tag-blue">Views: {blogViewCount}</span>
               </div>
               <Row gutter={[16, 16]} align='middle'>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                     <div className="blogDetailsShare">
                        <small>{blogData?.timeToRead}min. read</small>
                     </div>
                  </Col>
               </Row>

               <div className='gapMarginTop'></div>
               <div>
                  <Titles level={1} color='black' className='primaryColor'>{blogData?.title}</Titles>

                  <div className='gapMarginTop'></div>
                  <ParaText size='extraSmall' color='black'>{blogData?.description ? (
                     <div dangerouslySetInnerHTML={{ __html: blogData.description }}></div>
                  ) : (
                     'Loading...'
                  )}</ParaText>
                  <div className='gapMarginTop'></div>
                  <Row gutter={[16, 16]} align='middle'>
                     <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                        <div className="blogDetailsTag">
                           <div className="sidebarWidget">
                              <span className="label">Tags :</span>
                              <ul className="sidebarTag">

                              </ul>
                           </div>
                        </div>
                     </Col>
                     <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} className='textEnd'>
                        <div className="blogDetailsShare">
                           <small>{blogData?.timeToRead}min. read</small>
                        </div>
                     </Col>
                  </Row>
                  <div className='gapMarginTop'></div>
               </div>
            </div>


            <Row gutter={[16, 16]}>
               {randomThreeBlogPosts.map((item: any, key) => {
                  return (
                     <>
                        <Col xs={24} sm={24} md={8} lg={12} xl={8} xxl={8} key={item?.id}>
                           <Link href={`${process.env['NEXT_PUBLIC_SITE_URL']}/blog/${item.slug}`} passHref>
                              <div className="card">
                                 <div className="card__header">
                                    <Image preview={false} src={item.image ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/blogs/medium/${item.image}` : '/homes/default.png'} alt="card__image" className="card__image" />
                                 </div>
                                 <div className="card__body">
                                    <span className="tag tag-blue">StudyBuddy</span>
                                    <Titles level={5} color='black'>{item.title}</Titles>
                                    <ParaText size='extraSmall' color='black'> {item.description ? (
                                       <div dangerouslySetInnerHTML={{ __html: item.description.trim().slice(0, 100) }}></div>
                                    ) : (
                                       'Loading...'
                                    )}</ParaText>
                                 </div>
                                 <div className="card__footer">
                                    <div className="user">
                                       <Image src={item.authorId?.profileImage ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/authors/small/${item.authorId?.profileImage}` : '/homes/default.png'} alt="user__image" style={{
                                          width: 50, height: 50, borderRadius: 30
                                       }} />
                                       <div className="user__info">
                                          <h5>{item.authorId?.name}</h5>
                                          <small>{item.timeToRead}min. read</small>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </Link>
                        </Col>
                     </>
                  )
               })}
            </Row>
            <div className='gapMarginTop'></div>
         </div>
      </>
   )
}

