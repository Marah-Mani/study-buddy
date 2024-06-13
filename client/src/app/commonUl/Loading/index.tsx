import React from 'react';
import { DNA } from 'react-loader-spinner';

interface LoadingProps {
	height?: string;
}

export default function Loading({ height = '80vh' }: LoadingProps) {
	return (
		<div
			style={{
				width: '100%',
				height: `${height}`,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<DNA
				visible={true}
				height="100"
				width="200"
				ariaLabel="dna-loading"
				wrapperStyle={{}}
				wrapperClass="dna-wrapper"
			/>
		</div>
	);
}
