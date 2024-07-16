'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useEffect, useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import ErrorHandler from '@/lib/ErrorHandler';
import { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { message } from 'antd';

const api = axios.create({
	baseURL: process.env['NEXT_PUBLIC_API_URL'] || ''
});

interface AuthContextDefaults {
	user?: User | undefined;
	setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
	logout: () => Promise<void>;
	login: (email: string, password: string, url: string) => Promise<string>;
	chatSettings?: any;
	setChatSettings: React.Dispatch<React.SetStateAction<any>>;
}

interface AuthContextProp {
	children?: React.ReactNode;
}

const AuthContext = createContext<AuthContextDefaults>({
	logout: () => Promise.resolve(),
	login: () => Promise.resolve(''),
	setUser: () => { },
	chatSettings: undefined,
	setChatSettings: () => { }
});

const AuthContextProvider = ({ children }: AuthContextProp) => {
	const router = useRouter();
	const [user, setUser] = useState<User | undefined>();
	const [initialized, setInitialized] = useState<boolean>(false);
	const [chatSettings, setChatSettings] = useState<any>(undefined)

	useEffect(() => {
		const token = Cookies.get('session_token');
		const pathName = window.location.pathname;

		const checkSession = async () => {
			if (token) {
				try {
					const response = await api.get('/auth/check-session', {
						headers: {
							Authorization: `${token}`
						}
					});
					if (response && response.data && response.data.user) {
						if (pathName.includes('admin') && response.data.user.role == 'admin') {
							setUser(response.data.user);
							Cookies.set('session_token', response.data.refreshedToken);
						} else if (pathName.includes('user') && response.data.user.role == 'user') {
							setUser(response.data.user);
							Cookies.set('session_token', response.data.refreshedToken);
							// router.push('/');
						} else {
							setUser(response.data.user);
							Cookies.set('session_token', response.data.refreshedToken);
							// router.push('/');
						}
						setChatSettings(response.data.chatSettings)

					} else {
						Cookies.remove('session_token');
						setUser(undefined);
						router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}`);
					}

					setInitialized(true);
				} catch (error) {
					setInitialized(true);
					ErrorHandler.showNotification(error);
					Cookies.remove('session_token');
					setUser(undefined);
					router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}`);
				}
			}
			else {
				setInitialized(true);
				setUser(undefined);
				if (pathName.includes('admin') || pathName.includes('user')) {
					router.push('/');
				}
			}
		};

		checkSession();
	}, []);

	const login = async (email: string, password: string, url: string) => {
		const data = {
			email: email,
			password: password
		};
		const requestConfig: AxiosRequestConfig = {
			url: process.env['NEXT_PUBLIC_API_URL'] + '/auth/login',
			method: 'post',
			data: {
				...data
			}
		};

		try {
			const response = await axios(requestConfig);
			if (response && response.data && response.data.token && response.data.user) {
				const { token, user: loggedInUser } = response.data;
				axios.defaults.headers.common.Authorization = `Bearer ${token}`;
				Cookies.set('session_token', token);
				setUser(loggedInUser);
				setChatSettings(response.data.chatSettings);
				message.success('You are logged In!');
				if (url) {
					router.push(url);
				} else {
					switch (loggedInUser.role) {
						case 'admin':
							router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/admin/dashboard`);
							break;
						case 'user':
							router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/user/dashboard`);
							break;
						default:
							router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}`);
							break;
					}
				}

				return token;
			}
		} catch (error: any) {
			// console.log('Login error', error);
			ErrorHandler.showNotification(error);
		}
	};

	const logout = async (): Promise<void> => {
		setUser(undefined);
		Cookies.remove('session_token');
		router.push(`${process.env['NEXT_PUBLIC_SITE_URL']}/login`);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				logout,
				setUser,
				login,
				chatSettings,
				setChatSettings
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthContextProvider };
export default AuthContext;
