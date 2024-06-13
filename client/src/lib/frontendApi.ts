import axios from 'axios';
import { reject } from 'lodash';

export const uploadFile = ({ file }: any) => {
	const formData = new FormData();
	formData.append('image', file);

	return axios
		.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then((res) => res.data)
		.catch((err) => Promise.reject(err));
};

export const getAllBlogs = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/blogs`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleBlog = async (slug: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/blogs/single/${slug}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const blogViews = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/blogs/blogViews`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const contactUs = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/contactUs`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data: {
				...data
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getHeaderMenus = async (): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/menus/header`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleKnowledgeBase = async (id: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/knowledgeBase/single/${id}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getSingleForum = async (slug: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/forums/single/${slug}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const submitForumComment = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/forums/submit-comment`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const submitForumVote = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/forums/submit-vote`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const submitForumReply = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/forums/submit-reply`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const forumQuestionViews = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/forums/forum-views`,
			method: 'post',
			headers: {
				Accept: 'application/json'
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getRelatedForums = async (id: string): Promise<any> => {
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/forums/related-forums/${id}`,
			method: 'get',
			headers: {
				Accept: 'application/json'
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteComment = async (data: any): Promise<any> => {
	console.log(data, "data api")
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/forums/delete`,
			method: "post",
			headers: {
				Accept: "application/json"
			},
			data: data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
