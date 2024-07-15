'use client';
import { ReactNode } from 'react';
import { AuthContextProvider } from '@/contexts/AuthContext';
import { ConfigProvider } from 'antd';
import Cookie from 'js-cookie';
import axios from 'axios';
import AntdConfig from '@/lib/AntdConfig';
import { AntdRegistry } from '@ant-design/nextjs-registry';
const token = Cookie.get('session_token');

// axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
// axios.defaults.headers.common.Authorization = 'Bearer ' + token;
//axios.defaults.headers.common['Content-Type'] = `multipart/form-data;`;

type Props = {
	children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
	return (
		<AntdRegistry>
			<AuthContextProvider>
				<ConfigProvider
					theme={{
						token: {
							fontFamily: 'Lato, sans-serif',
							colorPrimary: '#f1a638',
							borderRadius: 7
						}
					}}
				>
					<AntdConfig>{children}</AntdConfig>
				</ConfigProvider>
			</AuthContextProvider>
		</AntdRegistry>
	);
}
