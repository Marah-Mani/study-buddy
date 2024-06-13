import { Image, ImageProps } from 'antd';
import { CSSProperties } from 'react';

interface ImageWithFallbackProps extends ImageProps {
	src: string;
	fallbackSrc: string;
	shouldPreview: boolean;
	styles?: CSSProperties;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, fallbackSrc, shouldPreview, styles, ...props }) => {
	return (
		<Image
			alt="image"
			src={src}
			preview={shouldPreview}
			placeholder={
				<Image
					alt="image"
					src={fallbackSrc}
					style={{ ...styles, filter: 'blur(2px)' }}
					preview={false}
					{...props}
				/>
			}
			fallback={fallbackSrc}
			style={{ ...styles }}
			{...props}
		/>
	);
};

export default ImageWithFallback;
