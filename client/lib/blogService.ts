import axios from 'axios';

// Create a new blog post
export const createBlog = async (title: string, content: string) => {
	try {
		const response = await axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/api/blogs`, { title, content });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

// Get all blog posts
export const getAllBlogs = async () => {
	try {
		const response = await axios.get(`${process.env['NEXT_PUBLIC_API_URL']}/api/blogs`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

// Update a blog post by ID
export const updateBlog = async (id: string, title: string, content: string) => {
	try {
		const response = await axios.put(`${process.env['NEXT_PUBLIC_API_URL']}/api/blogs/${id}`, { title, content });
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

// Delete a blog post by ID
export const deleteBlog = async (id: string) => {
	try {
		const response = await axios.delete(`${process.env['NEXT_PUBLIC_API_URL']}/api/blogs/${id}`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};
