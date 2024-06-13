import axios from 'axios';

export const login = async (username: string, password: string) => {
	try {
		const response = await axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/auth/login`, {
			username,
			password
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const logout = async () => {
	try {
		const response = await axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/auth/logout`);
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};

export const register = async (username: string, password: string) => {
	try {
		const response = await axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/auth/register`, {
			username,
			password
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response.data.message);
	}
};
