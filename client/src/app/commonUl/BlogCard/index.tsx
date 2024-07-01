import React from 'react';
import { Image } from 'antd';
import styles from './blogstyle.module.css'; // Update with the correct path
import Titles from '../Titles';
import ParaText from '../ParaText';
interface BlogCardProps {
	imageSrc: string;
	imageSize: number;
	alt: string;
	title: string;
	authorImageSrc: string;
	authorName: string;
	date: string;
	// shares: string;
	// content: React.ReactNode;
	postLink: string;
}
const BlogCard = ({
	imageSrc,
	imageSize,
	alt,
	title,
	authorImageSrc,
	authorName,
	date,
	// shares,
	// content,
	postLink
}: BlogCardProps) => {
	return (
		<div className={styles['blogText']}>
			<div className={styles['imageSection']}>
				<div className="blogImages">

				</div>
				<ParaText size="large" color="primaryColor">
					{title}
				</ParaText>
				<div className={styles['joannaWellick']}>
					<div className="flex">
						<Image src={authorImageSrc} alt="" className={styles['marginNone']} />
						<span className={styles['userName']}>{authorName}</span>
					</div>
					<span className={styles['date']}>{date}</span>
					{/* <span className={styles['shares']}>{shares} shares</span> */}
				</div>
				<ParaText size="small" color="defaultColor">
					{/* {content} */}
				</ParaText>
				<br />
				{/* <a href={postLink} target="_blank">
					View Post
				</a> */}
			</div>
		</div>
	);
};

export default BlogCard;
