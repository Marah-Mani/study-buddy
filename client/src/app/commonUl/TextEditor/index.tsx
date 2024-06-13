'use client';
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TextEditorProps {
	placeholder?: any;
	onChange?: any;
	value?: any;
	height?: number;
	theme?: string | 'snow';
}

const TextEditor: React.FC<TextEditorProps> = ({
	placeholder,
	onChange,
	value,
	height,
	theme = 'snow'
}: TextEditorProps) => {
	const modules = {
		toolbar: [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
			['link', 'image', 'video'],
			['clean']
		],
		clipboard: {
			matchVisual: false
		}
	};

	const formats = [
		'header',
		'font',
		'size',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
		'video',
		'align', // Added align format
		'script', // Added script format
		'header1',
		'header2',
		'header3',
		'header4',
		'header5', // Added header formats
		'paragraph' // Added paragraph format
	];

	return (
		<div>
			<ReactQuill
				theme={theme}
				onChange={onChange}
				value={value}
				modules={modules}
				formats={formats}
				placeholder={placeholder}
				style={{ height: `${height}px`, marginBottom: '60px' }}
			/>
		</div>
	);
};

export default TextEditor;
