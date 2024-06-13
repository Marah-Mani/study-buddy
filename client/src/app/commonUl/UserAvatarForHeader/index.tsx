'use client'
import React, { useContext, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AuthContext from '@/contexts/AuthContext';
import { FaRegUserCircle } from "react-icons/fa";
import { MdLock } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import ImageWithFallback from '@/components/ImageWithFallback';


export default function UserAvatarForHeader() {
   const { logout, user, setUser } = useContext(AuthContext);
   const [activeTab, setActiveTab] = useState('');
   const router = useRouter();
   function handleLogout(e: any) {
      e.preventDefault();
      logout();
   }
   console.log(user, 'user 11111')

   function handleLockScreen(e: any) {
      e.preventDefault();
      setUser(undefined);
      Cookies.remove('session_token');
      const userId = user?._id;
      router.replace(`/en/lock-screen?userId=${userId}`);
      window.history.forward();
   }
   function handleDashboard(e: any) {
      e.preventDefault();
   }

   function redirectToPage() {
      const page = user?.role === 'admin' ? '/en/admin/dashboard' : '/en/user/dashboard';
      router.push(page);
   }

   const items: MenuProps['items'] = [
      {
         label: (
            <div style={{ display: 'flex', marginTop: '12px', alignItems: 'center', marginLeft: '6px', cursor: 'pointer' }}>
               <ImageWithFallback
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${user?.image || ''}`}
                  fallbackSrc={`${process.env.NEXT_PUBLIC_IMAGE_URL}/avatar.png`}
                  alt="Profile"
                  style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }} shouldPreview={false} />
               <div ><span style={{ marginLeft: '15px' }}>{user?.name}</span></div>
            </div>
         ),
         key: '0',
      },


      {
         label: (
            <div
               className={` ${activeTab === '/en/admin/dashboard' || activeTab === '/en/user/dashboard' ? 'activeTab' : ''}`}
               onClick={redirectToPage}
            >
               <>
                  <MdSpaceDashboard style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
                  <span onClick={handleDashboard}>Dashboard</span>
               </>
            </div>
         ),
         key: '1',
      },

      {
         label: (
            <>
               <MdLock style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
               <span onClick={handleLockScreen}>Lock Screen</span>
            </>
         ),
         key: '2',
      },
      // {
      //    type: 'divider',
      // },
      {
         label: (
            <>
               <BiLogOut style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }} />
               <span onClick={handleLogout}>Logout</span>
            </>
         ),
         key: '3',
      },
   ];

   return (
      <Dropdown menu={{ items }} trigger={['click']}>
         <a onClick={(e) => e.preventDefault()}>
            <div style={{ marginRight: '10px', marginLeft: '6px', color: '#2C2C2C' }}>
               {user && user.image ? (
                  <img
                     src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${user.image}`}
                     alt="Avatar"


                     style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                  />
               ) : (
                  <img
                     src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/users.jpg`}
                     alt="Profile"


                     style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                  />
               )}
            </div>
         </a>
      </Dropdown>
   )
}


