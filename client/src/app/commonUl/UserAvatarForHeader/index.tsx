'use client'
import React, { useContext, useState } from 'react';
import { Avatar, MenuProps } from 'antd';
import { Dropdown, Image } from 'antd';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AuthContext from '@/contexts/AuthContext';
import { MdLock } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { FaUserEdit } from "react-icons/fa";

export default function UserAvatarForHeader() {
   const { logout, user, setUser } = useContext(AuthContext);
   const [activeTab, setActiveTab] = useState('');
   const router = useRouter();
   function handleLogout(e: any) {
      e.preventDefault();
      logout();
   }

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
      const page = user?.role === 'admin' ? '/en/admin/profile' : '/en/user/edit-profile';
      router.push(page);
   }

   const items: MenuProps['items'] = [
      {
         label: (
            <div style={{ display: 'flex', cursor: 'pointer' }}>
               {/* <ImageWithFallback
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/userImage/original/${user?.image || ''}`}
                  fallbackSrc={`${process.env.NEXT_PUBLIC_IMAGE_URL}/avatar.png`}
                  alt="Profile"
                  style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }} shouldPreview={false} /> */}
               <div ><span >{user?.name}</span></div>
            </div>
         ),
         key: '0',
      },
      {
         label: (
            <div
               className={` ${activeTab === '/en/admin/profile' || activeTab === '/en/user/profile' ? 'activeTab' : ''}`}
               onClick={redirectToPage}
            >
               <>
                  <div style={{ display: 'flex' }}>
                     <Image preview={false} src="/icons/yellowedit.png" alt="Inactive User" width={20} height={20} />
                     &nbsp;
                     &nbsp;
                     <span style={{ fontWeight: '500' }} onClick={handleDashboard}  >Profile</span>
                  </div>
               </>
            </div>
         ),
         key: '1',
      },

      {
         label: (
            <>
               <div style={{ display: 'flex' }}>
                  <MdLock size={20} style={{ marginRight: '10px', color: '#f0a551', fontWeight: '400' }} />
                  <span onClick={handleLockScreen} style={{ fontWeight: '500' }} >Lock Screen</span>
               </div>

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
               <div style={{ display: 'flex' }}>
                  <Image preview={false} src="/icons/yellow-off.png" alt="Inactive User" width={20} height={20} />
                  {/* <BiLogOut size={20} style={{ marginRight: '10px', color: '#F1A638' }} /> */}
                  &nbsp;
                  &nbsp;
                  <span onClick={handleLogout} style={{ fontWeight: '500' }} >Logout</span>
               </div>
            </>
         ),
         key: '3',
      },
   ];

   return (
      <Dropdown menu={{ items }} trigger={['click']}>
         <a onClick={(e) => e.preventDefault()}>
            <div style={{ marginRight: '10px', color: '#F1A638' }}>
               {user && user.image ? (
                  <img
                     src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/userImage/original/${user.image}`}
                     alt="Avatar"


                     style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                  />
               ) : (
                  <img
                     src={`${process.env.NEXT_PUBLIC_BASE_URL}/images/users.png`}
                     alt="Profile"


                     style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: '30px' }}
                  />
               )}
            </div>
         </a>
      </Dropdown >
   )
}


