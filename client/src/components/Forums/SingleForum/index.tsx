'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Avatar, Tooltip, Modal, Result, Image, Timeline, Input } from 'antd';
import './style.css';
import ErrorHandler from '@/lib/ErrorHandler';
import {
   forumQuestionViews,
   submitForumComment,
   submitForumReply,
   submitForumVote,
   deleteComment
} from '@/lib/frontendApi';
import AuthContext from '@/contexts/AuthContext';
import ParaText from '@/app/commonUl/ParaText';
import {
   LikeOutlined,
   ArrowLeftOutlined,
   DislikeOutlined,
   UserOutlined,
   MessageOutlined,
   LikeFilled,
   DislikeFilled
} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { useRouter } from 'next/navigation';
import RelativeTime from '@/app/commonUl/RelativeTime';
import { FaRegMessage } from 'react-icons/fa6';
import { validationRules } from '@/lib/validations';
import RightSection from './RightSection';
import { IoSendSharp } from 'react-icons/io5';
import { MdOutlineArrowBack } from 'react-icons/md';

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
   const [modal, setModal] = useState(false);
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
         const response = await fetch(
            'http://ip-api.com/json?fields=status,message,country,district,countryCode,region,regionName,city,zip,lat,lon,timezone,currency,isp,org,as,query'
         );
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
         };

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
         };

         const res = await submitForumVote(data);
         if (res.status == true) {
            setForumResult(res.data);
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   };

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
   };

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
         };

         const res = await submitForumReply(data);
         if (res.status == true) {
            setForumResult(res.data);
            setReply('');
            form.resetFields();
         }
      } catch (error) {
         ErrorHandler.showNotification(error);
      }
   };

   const deleteUserComments = async (commentId: string) => {
      try {
         const data = {
            id: user?._id,
            commentId: commentId,
            forumId: forumData?._id
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
         console.error('Error deleting comment:', error);
      }
   };

   return (
      <>
         <div className="contentBody">
            <Row gutter={[12, 12]}>
               <Col xs={24} sm={24} md={1} lg={1} xl={1} xxl={1}>
                  <div style={{ padding: '7px' }}>
                     <MdOutlineArrowBack
                        size={30}
                        className="backArrowIcon"
                        onClick={() => {
                           router.back();
                        }}
                     />
                  </div>
               </Col>
               <Col xs={24} sm={24} md={24} lg={15} xl={15} xxl={15}>
                  <div className="question">
                     <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={2} xl={2} xxl={1}>
                           <div style={{ display: 'flex', gap: '8px' }}>
                              <div>
                                 {forumData.userId.image ? (
                                    <Image
                                       src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${forumData.userId.image}`}
                                       alt="Avatar"
                                       width="40px"
                                       height="40px"
                                       style={{ borderRadius: '50px' }}
                                       preview={false}
                                    />
                                 ) : (
                                    <Avatar icon={<UserOutlined />} />
                                 )}
                              </div>
                           </div>
                        </Col>
                        <Col xs={24} sm={24} md={23} lg={22} xl={22} xxl={23}>
                           <div>
                              <span style={{ fontSize: '14px' }}>{forumData.userId.name}</span>
                              <br />
                              <span style={{ color: '#F2A638', fontSize: '12px', fontWeight: '400' }}>
                                 <RelativeTime date={forumData.createdAt} />
                              </span>
                           </div>
                           <ParaText size="extraSmall" fontWeightBold={400} color="black">
                              {forumData.title}
                           </ParaText>
                           <div style={{ wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: forumData?.description }}></div>
                           {/* FORUM LIKES & DISLIKES */}
                           <div className="smallTopMargin"></div>
                           <div style={{ display: 'flex', gap: '10px' }}>
                              <div style={{ cursor: 'pointer' }} onClick={() => handleVote('', '', 'like')}>
                                 <span className="orange-color">
                                    {dataSource.likes.includes(user?._id) ? (
                                       <LikeFilled />
                                    ) : (
                                       <LikeOutlined />
                                    )}
                                 </span>
                                 &nbsp; &nbsp;
                                 {dataSource.likes.length}
                              </div>
                              {/* <div style={{ cursor: 'pointer' }} onClick={() => handleVote('', '', 'dislike')}>
                                 <span className='orange-color'>
                                    {
                                       dataSource.dislikes.includes(user?._id)
                                          ? <DislikeFilled />
                                          : <DislikeOutlined />
                                    } </span> {dataSource.dislikes.length}
                              </div> */}
                              <div style={{ cursor: 'pointer' }}>
                                 <span className="orange-color">
                                    <MessageOutlined />
                                 </span>
                                 &nbsp; &nbsp;
                                 {dataSource?.comments?.length}
                              </div>
                              <div className="smallTopMargin"></div>
                           </div>

                           {/* COMMENT TEXTBOX */}
                           <div>
                              {comment && (
                                 <div style={{ paddingTop: '4px' }}>
                                    <div
                                       style={{ display: 'flex', gap: '10px', justifyContent: 'end' }}
                                       className="textEnd"
                                    >
                                       <div>
                                          <Button
                                             htmlType="submit"
                                             color="primary"
                                             onClick={() => handleSubmit()}
                                          >
                                             Submit
                                          </Button>
                                       </div>
                                       <div>
                                          <Button
                                             htmlType="submit"
                                             color="primary"
                                             onClick={() => {
                                                setCommentBox(false), setComment('');
                                             }}
                                          >
                                             Cancel
                                          </Button>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </Col>
                     </Row>
                  </div>
                  <Input
                     className="replyDivBorder"
                     value={comment}
                     onChange={(e) => {
                        if (!user) {
                           setModal(true);
                           return;
                        }
                        setComment(e.target.value);
                     }}
                     placeholder="Add a comment ..."
                     maxLength={validationRules.textEditor.maxLength}
                     minLength={validationRules.textEditor.minLength}
                     suffix={<IoSendSharp onClick={() => handleSubmit()} />} />
                  {/* COMMENTS LOOP */}

                  <div>
                     <ParaText
                        size="extraSmall"
                        fontWeightBold={600}
                        className="dBlock"
                        color="primaryColor"
                     >
                        Comments
                     </ParaText>
                     {dataSource?.comments?.map((comment: any, index: any) => {
                        return (
                           <>
                              {dataSource?.comments?.length > 0 && (
                                 <></>
                              )}
                              <Col md={24} key={index}>
                                 <div
                                    style={{ display: 'flex', gap: '8px', marginTop: '20px' }}
                                    className=""
                                 >
                                    <div>
                                       {comment.userId.image ? (
                                          <Image
                                             src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${comment.userId.image}`}
                                             alt="Avatar"
                                             width="40px"
                                             height="40px"
                                             style={{ borderRadius: '50px' }}
                                             preview={false}
                                          />
                                       ) : (
                                          <Avatar icon={<UserOutlined />} />
                                       )}
                                    </div>
                                    <div>
                                       <span style={{ fontSize: '14px' }}>{comment.userId.name}</span>
                                       <br />
                                       <span style={{ color: '#F2A638', fontSize: '12px', fontWeight: '400' }}>
                                          <RelativeTime date={comment.createdAt} />
                                       </span>
                                    </div>
                                 </div>
                                 <div className="smallTopMargin"></div>
                                 {/* COMMENT MESSAGE */}
                                 <div className="descriptionMargin">
                                    <div dangerouslySetInnerHTML={{ __html: comment?.message }}></div>
                                    {/* <Button onClick={() => deleteUserComments(comment._id)}>Delete</Button> */}

                                    <div className="smallTopMargin"></div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                       <div
                                          style={{
                                             cursor: 'pointer',
                                             display: 'flex',
                                             alignItems: 'center'
                                          }}
                                          onClick={() => handleVote(comment._id, '', 'like')}
                                       >
                                          <span className="orange-color">
                                             {comment.likes.includes(user?._id) ? (
                                                <LikeFilled />
                                             ) : (
                                                <LikeOutlined />
                                             )}
                                          </span>
                                          &nbsp; {comment.likes.length}
                                       </div>
                                       {/* <div style={{ cursor: 'pointer' }} onClick={() => handleVote(comment._id, '', 'dislike')}>
                                          <span className='orange-color'>
                                             {
                                                comment.dislikes.includes(user?._id)
                                                   ? <DislikeFilled />
                                                   : <DislikeOutlined />
                                             }</span> {comment.dislikes.length}
                                       </div> */}
                                       <div
                                          style={{
                                             cursor: 'pointer',
                                             display: 'flex',
                                             alignItems: 'center'
                                          }}
                                          onClick={() => handleComment(comment._id)}
                                       >
                                          <span className="orange-color">
                                             <MessageOutlined />
                                          </span>
                                          &nbsp; {comment.replies.length}
                                       </div>
                                       <br />

                                       {!commentBox && forumId == comment._id && (
                                          <div
                                             style={{ cursor: 'pointer' }}
                                             onClick={() => setCommentBox(true)}
                                          >
                                             <Button type="link">Add reply</Button>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                                 <div className="mediumTopMargin"></div>
                              </Col>
                              <br />
                              {/* REPLY TEXTAREA */}
                              {commentBox && forumId == comment._id ? (
                                 <>
                                    <Col md={3}></Col>
                                    <Col md={21}>
                                       {commentBox && (
                                          <div className="">
                                             <TextArea
                                                rows={1}
                                                value={reply}
                                                onChange={(e) => {
                                                   if (!user) {
                                                      setModal(true);
                                                      return;
                                                   }
                                                   setReply(e.target.value);
                                                }}
                                                placeholder="Add a reply ..."
                                                maxLength={validationRules.textEditor.maxLength}
                                                minLength={validationRules.textEditor.minLength}
                                             />
                                          </div>
                                       )}
                                    </Col>
                                    <div>
                                       {reply && (
                                          <div style={{ paddingTop: '4px', marginTop: '10px' }}>
                                             <div
                                                style={{
                                                   display: 'flex',
                                                   gap: '10px',
                                                   justifyContent: 'end',
                                                   float: 'right'
                                                }}

                                             >
                                                <div>
                                                   <Button
                                                      htmlType="submit"
                                                      color="primary"
                                                      onClick={() => handleSubmitReply(comment._id)}
                                                   >
                                                      Submit
                                                   </Button>
                                                </div>
                                                <div>
                                                   <Button
                                                      htmlType="submit"
                                                      color="primary"
                                                      onClick={() => setCommentBox(false)}
                                                   >
                                                      Cancel
                                                   </Button>
                                                </div>
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                    <div className="mediumTopMargin"></div>
                                 </>
                              ) : null}
                              {/* REPLIES LOOP */}
                              {forumId == comment._id && (
                                 <>
                                    <Col md={3}></Col>
                                    <Col md={21}>
                                       {comment?.replies?.length > 0 && (
                                          <ParaText
                                             size="extraSmall"
                                             fontWeightBold={600}
                                             color="primaryColor"
                                          >
                                             Replies
                                          </ParaText>
                                       )}
                                       <div className="smallTopMargin"></div>
                                       {comment?.replies?.map((reply: any, index: any) => {
                                          return (
                                             <Timeline key={index}>
                                                <Timeline.Item key={index}>
                                                   <Row>
                                                      <Col md={21}>
                                                         <div
                                                            style={{ display: 'flex', gap: '8px' }}
                                                         >
                                                            <div>
                                                               <Tooltip
                                                                  color={''}
                                                                  title={
                                                                     <div
                                                                        style={{
                                                                           display: 'flex',
                                                                           gap: '8px'
                                                                        }}
                                                                     >
                                                                        <div>
                                                                           {reply.userId
                                                                              ?.image ? (
                                                                              <Image
                                                                                 src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${reply.userId.image}`}
                                                                                 alt="Avatar"
                                                                                 width="40px"
                                                                                 height="40px"
                                                                                 style={{
                                                                                    borderRadius:
                                                                                       '50px'
                                                                                 }}
                                                                                 preview={
                                                                                    false
                                                                                 }
                                                                              />
                                                                           ) : (
                                                                              <Avatar
                                                                                 icon={
                                                                                    <UserOutlined />
                                                                                 }
                                                                              />
                                                                           )}
                                                                        </div>
                                                                        <div>
                                                                           <span
                                                                              style={{
                                                                                 fontSize:
                                                                                    '14px'
                                                                              }}
                                                                           >
                                                                              {
                                                                                 reply.userId
                                                                                    ?.name
                                                                              }
                                                                           </span>
                                                                           <br />
                                                                           <span>
                                                                              <RelativeTime
                                                                                 date={
                                                                                    reply.createdAt
                                                                                 }
                                                                              />
                                                                           </span>
                                                                           <br />
                                                                           <span>
                                                                              {
                                                                                 reply.userId
                                                                                    ?.email
                                                                              }
                                                                           </span>
                                                                        </div>
                                                                     </div>
                                                                  }
                                                               >
                                                                  {reply.userId?.image ? (
                                                                     <Image
                                                                        src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${reply.userId.image}`}
                                                                        alt="Avatar"
                                                                        width="40px"
                                                                        height="40px"
                                                                        style={{
                                                                           borderRadius: '50px'
                                                                        }}
                                                                        preview={false}
                                                                     />
                                                                  ) : (
                                                                     <Avatar
                                                                        size={40}
                                                                        icon={<UserOutlined />}
                                                                     />
                                                                  )}
                                                               </Tooltip>
                                                            </div>
                                                            <div>
                                                               <span style={{ fontSize: '14px' }}>
                                                                  {reply.userId?.name}
                                                               </span>
                                                               <br />
                                                               <span className="orange-color">
                                                                  <RelativeTime
                                                                     date={reply.createdAt}
                                                                  />
                                                               </span>
                                                            </div>
                                                         </div>

                                                         <div className="smallTopMargin"></div>
                                                         <div className="descriptionMargin">
                                                            <div
                                                               dangerouslySetInnerHTML={{
                                                                  __html: reply?.message
                                                               }}
                                                            ></div>
                                                            <div className="smallTopMargin"></div>
                                                            <div
                                                               style={{
                                                                  display: 'flex',
                                                                  gap: '10px'
                                                               }}
                                                            >
                                                               <div
                                                                  className="orange-color"
                                                                  style={{ cursor: 'pointer' }}
                                                                  onClick={() =>
                                                                     handleVote(
                                                                        comment._id,
                                                                        reply._id,
                                                                        'like'
                                                                     )
                                                                  }
                                                               >
                                                                  {reply.likes.includes(
                                                                     user?._id
                                                                  ) ? (
                                                                     <LikeFilled />
                                                                  ) : (
                                                                     <LikeOutlined />
                                                                  )}{' '}
                                                                  <span style={{ color: '#424242' }}> {reply.likes.length}</span>
                                                               </div>
                                                               <div
                                                                  style={{ cursor: 'pointer' }}
                                                                  onClick={() =>
                                                                     handleVote(
                                                                        comment._id,
                                                                        reply._id,
                                                                        'dislike'
                                                                     )
                                                                  }
                                                               >
                                                                  <span className="orange-color">
                                                                     <MessageOutlined />
                                                                  </span>
                                                                  &nbsp; {comment.replies.length}

                                                               </div>
                                                            </div>
                                                         </div>
                                                         <div className="smallTopMargin"></div>
                                                      </Col>
                                                   </Row>
                                                </Timeline.Item>
                                             </Timeline>
                                          );
                                       })}
                                    </Col>
                                 </>
                              )}
                           </>
                        );
                     })}
                  </div >
               </Col>
               <Col md={7}>
                  <RightSection categoryId={forumData.categoryId} />
               </Col>
            </Row>
            <Modal open={modal} onCancel={() => setModal(false)} footer={null}>
               <Result
                  status="info"
                  title="You need to be logged in to perform this action"
                  extra={
                     <Button
                        type="primary"
                        ghost
                        onClick={() => router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/login`)}
                     >
                        Login
                     </Button>
                  }
               />
            </Modal>
         </div>
      </>
   );
}
