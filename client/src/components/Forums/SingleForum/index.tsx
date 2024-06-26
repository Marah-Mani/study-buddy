"use client"
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Avatar, Tooltip, Modal, Result, Image, Timeline } from 'antd';
import './style.css'
import ErrorHandler from '@/lib/ErrorHandler';
import { forumQuestionViews, submitForumComment, submitForumReply, submitForumVote, deleteComment } from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import ParaText from '@/app/commonUl/ParaText';
import { LikeOutlined, ArrowLeftOutlined, DislikeOutlined, UserOutlined, MessageOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import RelativeTime from '@/app/commonUl/RelativeTime';
import { FaRegMessage } from 'react-icons/fa6';
import { validationRules } from '@/lib/validations';
import RightSection from './RightSection';


interface Props {
   forumData?: any;
}
export default function SingleForum({ forumData }: Props) {
   const [forumResult, setForumResult] = useState<any>([]);
   const { user } = useContext(AuthContext);
   const [comment, setComment] = useState<any>();
   const [form] = Form.useForm();
   const [commentBox, setCommentBox] = useState(false);
   const [reply, setReply] = useState<any>();
   const [forumId, setForumId] = useState('');
   const [modal, setModal] = useState(false)
   const router = useRouter();

   useEffect(() => {
      const timeout = setTimeout(() => {
         fetchViewsData();
      }, 5000);

      return () => clearTimeout(timeout);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const fetchViewsData = async () => {
      try {
         const response = await fetch('http://ip-api.com/json?fields=status,message,country,district,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,query');
         const data = await response.json();
         const browserName = getBrowserName(navigator.userAgent);
         const operatingSystem = navigator.platform;
         const deviceName = getDeviceName(navigator.userAgent);

         const viewsData = {
            ...data,
            forumId: forumData?._id,
            browserName: browserName,
            operatingSystem: operatingSystem,
            deviceName: deviceName
         };

         await forumQuestionViews(viewsData);
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

   const handleSubmit = async () => {
      try {
         if (!user) {
            setModal(true);
            return;
         }
         const data = {
            forumId: forumData?._id,
            comment: comment,
            userId: user?._id
         }

         const res = await submitForumComment(data);
         if (res.status == true) {
            setForumResult(res.data);
            setComment('');
            setCommentBox(false);
            form.resetFields();
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   };

   const handleVote = async (commentId: string, replyId: string, vote: any) => {
      try {
         if (!user) {
            setModal(true);
            return;
         }
         const data = {
            forumId: forumData?._id,
            commentId: commentId,
            userId: user?._id,
            type: vote,
            replyId: replyId
         }

         const res = await submitForumVote(data);
         if (res.status == true) {
            setForumResult(res.data);
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   }

   let dataSource: any;
   if (forumResult && forumResult?.comments?.length > 0) {
      dataSource = forumResult;
   } else {
      dataSource = forumData;
   }

   const handleComment = (commentId: string) => {
      setCommentBox(true);
      if (commentId == forumId) {
         setForumId('');
      } else {
         setForumId(commentId);
      }
   }

   const handleSubmitReply = async (commentId: string) => {
      try {
         if (!user) {
            setModal(true);
            return;
         }
         const data = {
            forumId: forumData?._id,
            commentId: commentId,
            userId: user?._id,
            message: reply
         }

         const res = await submitForumReply(data);
         if (res.status == true) {
            setForumResult(res.data);
            setReply('');
            form.resetFields();
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   }


   const deleteUserComments = async (commentId: string) => {
      try {
         const data = {
            id: user?._id,
            commentId: commentId,
            forumId: forumData?._id,
         };
         const response = await deleteComment(data);
         if (response.status == true) {
            // Update the forumResult state with the new data or null
            setForumResult(response.data || null);
            // Optionally, you can reset other state variables
            setReply('');
            form.resetFields();
         }
      } catch (error) {
         console.error("Error deleting comment:", error);
      }
   };


   return (
      <>
         <div className='contentBody'>
            <Row style={{ padding: '20px' }} gutter={[12, 12]}>
               <Col md={1}>
                  <div style={{ padding: '7px' }}>
                     <ArrowLeftOutlined className='backArrowIcon' onClick={() => {
                        router.back()
                     }} />
                  </div>
               </Col>
               <Col md={15}>
                  <div style={{ padding: "4px" }}>
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <div>
                           {forumData.userId.image ?
                              <Image
                                 src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${forumData.userId.image}`
                                 }
                                 alt="Avatar"
                                 width="40px"
                                 height="40px"
                                 style={{ borderRadius: '50px' }}
                                 preview={false}
                              />
                              :
                              <Avatar icon={<UserOutlined />} />
                           }
                        </div>
                        <div>
                           <span style={{ fontSize: '14px' }}>
                              {forumData.userId.name}

                           </span>
                           <br />
                           <span><RelativeTime date={forumData.createdAt} /></span>
                        </div>
                     </div>
                     <ParaText size="large" fontWeightBold={600} color="primaryColor">
                        {forumData.title}
                     </ParaText>
                     <div className="smallTopMargin"></div>
                     <div dangerouslySetInnerHTML={{ __html: forumData?.description }}></div>
                     <div className="mediumTopMargin"></div>

                     {/* FORUM LIKES & DISLIKES */}
                     <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ cursor: 'pointer' }} onClick={() => handleVote('', '', 'like')}>
                           {
                              dataSource.likes.includes(user?._id)
                                 ? <LikeFilled />
                                 : <LikeOutlined />
                           }
                           {dataSource.likes.length}
                        </div>
                        <div style={{ cursor: 'pointer' }} onClick={() => handleVote('', '', 'dislike')}>
                           {
                              dataSource.dislikes.includes(user?._id)
                                 ? <DislikeFilled />
                                 : <DislikeOutlined />
                           } {dataSource.dislikes.length}
                        </div>
                        <div style={{ cursor: 'pointer' }} >
                           <MessageOutlined /> {dataSource?.comments?.length}
                        </div>
                        <div className="smallTopMargin"></div>
                     </div>

                     {/* COMMENT TEXTBOX */}
                     <div className='replyDivBorder'>
                        <div className='customTextArea'>
                           <TextArea rows={1} value={comment} onChange={(e) => {
                              if (!user) {
                                 setModal(true);
                                 return;
                              }
                              setComment(e.target.value);
                           }
                           }
                              placeholder='Add a comment ...'
                              maxLength={validationRules.textEditor.maxLength}
                              minLength={validationRules.textEditor.minLength}
                           />
                        </div>

                     </div>
                     <div>
                        {comment &&
                           <div style={{ paddingTop: '4px' }}>
                              <div style={{ display: 'flex', gap: '10px', justifyContent: 'end' }} className="textEnd">
                                 <div>
                                    <Button htmlType="submit" color='primary' onClick={() => handleSubmit()}>
                                       Submit
                                    </Button>
                                 </div>
                                 <div>
                                    <Button htmlType="submit" color='primary' onClick={() => { setCommentBox(false), setComment('') }}>
                                       Cancel
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        }
                     </div>
                     {dataSource?.comments?.length > 0 &&
                        <ParaText size="large" fontWeightBold={600} color="primaryColor">
                           Comments
                        </ParaText>
                     }
                  </div>
                  {/* COMMENTS LOOP */}
                  <Row>
                     {dataSource?.comments?.map((comment: any, index: any) => {
                        return (
                           <>
                              <div className="smallTopMargin"></div>
                              <Col md={24} key={index}>
                                 <div style={{ display: 'flex', gap: '8px' }}>
                                    <div>
                                       {comment.userId.image ?
                                          <Image
                                             src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${comment.userId.image}`
                                             }
                                             alt="Avatar"
                                             width="40px"
                                             height="40px"
                                             style={{ borderRadius: '50px' }}
                                             preview={false}
                                          />
                                          :
                                          <Avatar icon={<UserOutlined />} />
                                       }
                                    </div>
                                    <div>
                                       <span style={{ fontSize: '14px' }}>
                                          {comment.userId.name}
                                       </span>
                                       <br />
                                       <span><RelativeTime date={comment.createdAt} /></span>
                                    </div>
                                 </div>
                                 <div className="smallTopMargin"></div>
                                 {/* COMMENT MESSAGE */}
                                 <div className='descriptionMargin'>
                                    <div dangerouslySetInnerHTML={{ __html: comment?.message }}></div>
                                    {/* <Button onClick={() => deleteUserComments(comment._id)}>Delete</Button> */}

                                    <div className="smallTopMargin"></div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                       <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, '', 'like')}>
                                          {
                                             comment.likes.includes(user?._id)
                                                ? <LikeFilled />
                                                : <LikeOutlined />
                                          }
                                          {comment.likes.length}
                                       </div>
                                       <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, '', 'dislike')}>
                                          {
                                             comment.dislikes.includes(user?._id)
                                                ? <DislikeFilled />
                                                : <DislikeOutlined />
                                          } {comment.dislikes.length}
                                       </div>
                                       <div style={{ cursor: 'pointer' }} onClick={() => handleComment(comment._id)}>

                                          <FaRegMessage /> {comment.replies.length} { }


                                       </div>

                                       {!commentBox && forumId == comment._id &&
                                          <div style={{ cursor: 'pointer' }} onClick={() => setCommentBox(true)}>
                                             <Button
                                                type='link'
                                             >
                                                Add reply
                                             </Button>

                                          </div>
                                       }
                                    </div>
                                 </div>
                                 <div className="mediumTopMargin"></div>
                              </Col>
                              {/* REPLY TEXTAREA */}
                              {commentBox && forumId == comment._id ?
                                 <>

                                    <Col md={3}></Col>
                                    <Col md={21}>
                                       {commentBox &&
                                          <div className='replyDivBorder'>
                                             <div className='customTextArea'>
                                                <TextArea rows={1} value={reply} onChange={(e) => {
                                                   if (!user) {
                                                      setModal(true);
                                                      return;
                                                   }
                                                   setReply(e.target.value)
                                                }
                                                }
                                                   placeholder='Add a reply ...'
                                                   maxLength={validationRules.textEditor.maxLength}
                                                   minLength={validationRules.textEditor.minLength}
                                                />
                                             </div>
                                             <div>

                                             </div>
                                          </div>

                                       }
                                    </Col>
                                    <div>
                                       {reply &&
                                          <div style={{ paddingTop: '4px' }}>
                                             <div style={{ display: 'flex', gap: '10px', justifyContent: 'end' }} className="textEnd">
                                                <div>
                                                   <Button htmlType="submit" color='primary' onClick={() => handleSubmitReply(comment._id)}>
                                                      Submit
                                                   </Button>
                                                </div>
                                                <div>
                                                   <Button htmlType="submit" color='primary' onClick={() => setCommentBox(false)}>
                                                      Cancel
                                                   </Button>
                                                </div>
                                             </div>

                                          </div>
                                       }
                                    </div>
                                    <div className="mediumTopMargin"></div>
                                 </>
                                 : null
                              }
                              {/* REPLIES LOOP */}
                              {forumId == comment._id &&
                                 <>
                                    <Col md={3}></Col>
                                    <Col md={21}>
                                       {comment?.replies?.length > 0 &&
                                          <ParaText size="large" fontWeightBold={600} color="primaryColor">
                                             Replies
                                          </ParaText>
                                       }
                                       <div className="smallTopMargin"></div>
                                       {
                                          comment?.replies?.map((reply: any, index: any) => {
                                             return (
                                                <Timeline key={index}>
                                                   <Timeline.Item key={index}>
                                                      <Row>
                                                         <Col md={21}>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                               <div>
                                                                  <Tooltip
                                                                     color={''}
                                                                     title={(
                                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                           <div>
                                                                              {reply.userId?.image ?
                                                                                 <Image
                                                                                    src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${reply.userId.image}`}
                                                                                    alt="Avatar"
                                                                                    width="40px"
                                                                                    height="40px"
                                                                                    style={{ borderRadius: '50px' }}
                                                                                    preview={false}
                                                                                 />
                                                                                 :
                                                                                 <Avatar icon={<UserOutlined />} />
                                                                              }
                                                                           </div>
                                                                           <div>
                                                                              <span style={{ fontSize: '14px' }}>
                                                                                 {reply.userId?.name}
                                                                              </span>
                                                                              <br />
                                                                              <span><RelativeTime date={reply.createdAt} /></span>
                                                                              <br />
                                                                              <span>{reply.userId?.email}</span>
                                                                           </div>
                                                                        </div>
                                                                     )}
                                                                  >
                                                                     {reply.userId?.image ?
                                                                        <Image
                                                                           src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${reply.userId.image}`}
                                                                           alt="Avatar"
                                                                           width="40px"
                                                                           height="40px"
                                                                           style={{ borderRadius: '50px' }}
                                                                           preview={false}
                                                                        />
                                                                        :
                                                                        <Avatar size={40} icon={<UserOutlined />} />
                                                                     }
                                                                  </Tooltip>
                                                               </div>
                                                               <div>
                                                                  <span style={{ fontSize: '14px' }}>
                                                                     {reply.userId?.name}
                                                                  </span><br />
                                                                  <span><RelativeTime date={reply.createdAt} /></span>
                                                               </div>
                                                            </div>

                                                            <div className="smallTopMargin"></div>
                                                            <div className='descriptionMargin'>
                                                               <div dangerouslySetInnerHTML={{ __html: reply?.message }}></div>
                                                               <div className="smallTopMargin"></div>
                                                               <div style={{ display: 'flex', gap: '10px' }}>
                                                                  <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, reply._id, 'like')}>
                                                                     {reply.likes.includes(user?._id)
                                                                        ? <LikeFilled />
                                                                        : <LikeOutlined />
                                                                     } {reply.likes.length}
                                                                  </div>
                                                                  <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, reply._id, 'dislike')}>
                                                                     {reply.dislikes.includes(user?._id)
                                                                        ? <DislikeFilled />
                                                                        : <DislikeOutlined />
                                                                     } {reply.dislikes.length}
                                                                  </div>
                                                               </div>
                                                            </div>
                                                            <div className="smallTopMargin"></div>
                                                         </Col>
                                                      </Row>
                                                   </Timeline.Item>
                                                </Timeline>
                                             );
                                          })

                                       }
                                    </Col>
                                 </>}
                           </>
                        )
                     })}
                  </Row>
               </Col>
               <Col md={7}>
                  <RightSection categoryId={forumData.categoryId}
                  />
               </Col>
            </Row>
            <Modal
               open={modal}
               onCancel={() => setModal(false)}
               footer={null}
            >
               <Result
                  status="info"
                  title="You need to be logged in to perform this action"
                  extra={
                     <Button type='primary' ghost
                        onClick={() => router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)}>
                        Login
                     </Button>
                  }
               />
            </Modal>
         </div>
      </>
   )
}

