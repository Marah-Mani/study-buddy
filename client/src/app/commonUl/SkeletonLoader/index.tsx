import React from 'react';
import './styles.css';

interface SkeletonLoaderProps {
	height?: string;
	width?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ height, width }) => {
	return <div className="skeleton-loading" style={{ height: height, width: width }}></div>;
};

export default SkeletonLoader;
