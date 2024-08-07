import { Flex, Spin } from 'antd';
import React from 'react';

interface LoadingProps {
	height?: string;
}

export default function Loading({ height = '80vh' }: LoadingProps) {
	return (
		<Flex style={{ height: `${height}` }} gap="large" justify={'center'} align={'center'} vertical>
			<Spin tip="Loading..." size="large"></Spin>
		</Flex>
	);
}
