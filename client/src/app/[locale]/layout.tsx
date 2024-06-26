import React from 'react';
import './custom.css';
import './globals.css';
import './darkMode.css';
import { AuthContextProvider } from '@/contexts/AuthContext';
import AntdConfig from '@/lib/AntdConfig';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import Providers from '@/components/Providers';

interface RootLayoutProps {
	children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
	return (
		<html>
			<body>
				<AntdRegistry>
					<AuthContextProvider>
						<AntdConfig>
							<Providers>{children}</Providers>
						</AntdConfig>
					</AuthContextProvider>
				</AntdRegistry>
			</body>
		</html>
	);
};

export default RootLayout;
