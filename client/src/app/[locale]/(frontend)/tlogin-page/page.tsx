'use client';
import React, { useContext, useEffect } from 'react';
import { Button } from 'antd';
import Link from 'next/link';
import AuthContext from '@/contexts/AuthContext';
import TimeZoneDisplay from '@/app/commonUl/TimeZoneDisplay';
import { regSw, subscribe } from '@/helper/webNotification';
import { BsWhatsapp } from 'react-icons/bs';;
export default function Page() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        async function registerAndSubscribe() {
            try {
                const serviceWorkerReg = await regSw();
                await subscribe(serviceWorkerReg);
            } catch (error) {
                console.log(error);
            }
        }
        registerAndSubscribe();
    }, []);
    return (
        <>
            <div style={{ maxWidth: '300px', margin: 'auto', paddingTop: '300px' }}>
                <h1 style={{ textAlign: 'center' }}>Home</h1>
                <p style={{ textAlign: 'center' }}>Welcome to your home page!</p>
                <p style={{ textAlign: 'center' }}><TimeZoneDisplay userTimeZone={user?.timeZone} /></p>
                {user ? (
                    <>
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <p>Hello, {user.name}!</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Button type="primary" onClick={logout}>
                                Logout
                            </Button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Link href="/en/payment" passHref>
                                <Button type="primary" style={{ width: '100%' }}>
                                    Payment
                                </Button>
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <Link href="/en/login" passHref>
                                <Button type="primary">Login</Button>
                            </Link>
                        </div>
                    </>
                )}
                <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                    <Link href="https:wa.me/9596444365" passHref target='_blank'>
                        <BsWhatsapp size={40} color="green" />
                    </Link>
                </div>
            </div>
        </>
    )
}

