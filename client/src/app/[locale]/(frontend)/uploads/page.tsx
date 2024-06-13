'use client';

import { useState } from 'react';
import ImgCrop from 'antd-img-crop';
import { message, Upload, List, Divider } from 'antd';
import { uploadFile } from '@/lib/frontendApi';
import './styles.css';
import Titles from '@/app/commonUl/Titles';
import ParaText from '@/app/commonUl/ParaText';

export default function Uploads() {
	const [fileList, setFileList] = useState<any[]>([]);

	// const getSrcFromFile = (file: any) => {
	// 	return new Promise((resolve) => {
	// 		const reader = new FileReader();
	// 		reader.readAsDataURL(file.originFileObj);
	// 		reader.onload = () => resolve(reader.result);
	// 	});
	// };

	// const onPreview = async (file: any) => {
	// 	const src = file.url || (await getSrcFromFile(file));
	// 	console.log(src);
	// 	const imgWindow = window.open(src);

	// 	if (imgWindow) {
	// 		const image = new Image();
	// 		image.src = src;
	// 		imgWindow.document.write(image.outerHTML);
	// 	} else {
	// 		window.location.href = src;
	// 	}
	// };

	const data = [
		'Image being uploaded can be cropped or rotated',
		'On successful upload, images can be found in "src/storage" directory',
		'image on upload will be resized into three fixed size i.e. "small", "medium", and  "original" and will be saved inside the directory in their respective folders',
		'Please make sure, to have these three folders inside src/storage'
	];

	const handleUpload = async ({ file }: any) => {
		try {
			const response = await uploadFile({ file });
			if (response && response.message) {
				setTimeout(() => {
					const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
					setFileList(updatedFileList);
					message.success(response.message);
				}, 1000);
			} else {
				message.error('Failed to upload file');
			}
		} catch (error) {
			console.error('Error uploading file:', error);
			message.error('Failed to upload file');
		}
	};

	const handleSuccess = (file: any) => {
		const reader = new FileReader();
		reader.readAsDataURL(file.originFileObj);
		reader.onload = () => {
			const imgWindow = window.open(reader.result as string);
			if (!imgWindow) {
				window.location.href = reader.result as string;
			}
		};
	};

	const uploadProps = {
		fileList,
		beforeUpload: (file: any) => {
			const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
			if (!isJpgOrPng) {
				message.error('You can only upload JPG/PNG files!');
				return Upload.LIST_IGNORE;
			}
			return isJpgOrPng;
		},
		customRequest: handleUpload,
		onSuccess: handleSuccess
	};

	const onChange = ({ fileList: newFileList }: any) => {
		setFileList(newFileList);
	};

	return (
		<section>
			<div>
				<Titles level={4}>Image Upload with manual crop, and auto-resize functionality</Titles>
			</div>
			<div className="container">
				<ImgCrop showGrid rotationSlider aspectSlider showReset>
					<Upload listType="picture-card" onChange={onChange} {...uploadProps}>
						{fileList.length < 1 && '+ Upload'}
					</Upload>
				</ImgCrop>
			</div>
			<div>
				<List
					header={<Titles level={3}> Description </Titles>}
					dataSource={data}
					renderItem={(item) => (
						<List.Item>
							<ParaText>{item}</ParaText>
						</List.Item>
					)}
				></List>
			</div>
		</section>
	);
}
