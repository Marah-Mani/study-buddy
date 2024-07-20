import { message } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import { reject } from 'lodash';


export const getUserNotification = async (userId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {

		const req = axios.get(`${process.env['NEXT_PUBLIC_API_URL']}/common/notification/${userId}`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const updateReadStatus = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const token = Cookies.get('session_token');
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/notification/mark-all-as-read`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const updateAllReadStatus = async (data: any): Promise<any> => {
	return new Promise((resolve, reject) => {
		const token = Cookies.get('session_token');
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/notification/mark-all-as-read`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteAllMessages = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/notification/delete-all-messages`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteMessage = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/notification/delete-messages`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const storeCardDetail = async (data: any) => {
	const token = Cookies.get('session_token');
	const res: any = await axios
		.post(`${process.env['NEXT_PUBLIC_API_URL']}/common/profile/store-payment-method`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		})
		.catch((error) => {
			if (error.response) {
				message.error(error.response.data.message);
			}
		});

	return res.data;
};

export const getAllCards = async (data: any) => {
	try {
		const token = Cookies.get('session_token');
		const res = await axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/common/profile/cards`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		return res.data;
	} catch (err) {
		throw err;
	}
};


export const deleteCard = async (data: any) => {
	try {
		const token = Cookies.get('session_token');
		const res = await axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/common/profile/delete-card`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		return res.data;
	} catch (err) {
		throw err;
	}
};

export const addUpdateTicketDetails = async (formData: any): Promise<any> => {
	console.log(formData, "data")
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/common/ticket/addUpdateTicketDetails`, formData, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllTicketsWithParams = async ({ role, userId, page, pageSize, status }: { role?: string; userId?: string; page?: number; pageSize?: number, status?: string } = {}): Promise<any> => {
	const token = Cookies.get('session_token');
	const params: { role?: string; userId?: string; page?: number; pageSize?: number; status?: string } = {
	};
	if (role !== undefined) {
		params['role'] = role;
	}
	if (userId !== undefined) {
		params['userId'] = userId;
	}
	if (page !== undefined) {
		params['page'] = page;
	}
	if (pageSize !== undefined) {
		params['pageSize'] = pageSize;
	} if (status !== undefined) {
		params['status'] = status;
	}
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/ticket/ticketsWithParams`,
			method: 'get',
			params,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllUsers = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/user/allUsers`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllCandidate = async (query: any = {}): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/user/getAllCandidate`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: query
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllDepartments = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/user/getAllDepartments`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const addUpdateTodo = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/todo/addUpdateTodo`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllTodo = async (query: any = {}): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/todo`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: query // Pass query parameters
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getUserTodo = async (data: any): Promise<any> => {
	const token = Cookies.get("session token");
	return new Promise((resolve, reject) => {
		axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/todo/getTodo`,
			method: "post",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${token}`
			},
			data: data

		})
			.then((res) => resolve(res.data))
			.catch((err) => reject(err));
	});
};




export const deleteTodo = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/todo/deleteTodo`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data: {
				...data
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllEvents = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/todo/getAllEvents`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			// Pass query parameters
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getEventsById = async (id: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/todo/getEventsById/${id}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			// Pass query parameters
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllRoles = async (search?: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/user/allRoles`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: {
				search
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};



export const getSingleTicketData = async (ticketId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.get(`${process.env['NEXT_PUBLIC_API_URL']}/common/ticket/details/${ticketId}`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const deleteTicket = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/ticket/delete-ticket`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const updateTicketStatus = async (data: any): Promise<any> => {
	console.log(data, "status")
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/common/ticket/updateTicketStatus`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllTickets = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/ticket`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const assignTicket = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/common/ticket/assignTicket`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getAllUserData = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/ticket/getticketusers`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const addChatDetails = async (data: any): Promise<any> => {
	console.log(data, "data")
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/common/ticketchat/addChatDetails`, data, {
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getChatDetail = async (ticketId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.get(`${process.env['NEXT_PUBLIC_API_URL']}/common/ticketchat/details/${ticketId}`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const addUpdateForumData = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/forum/update-forum-data`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary = ${data._boundary} `,
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteForumAttachment = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/forum/delete-forum-attachment`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteForum = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/forum/delete-forum`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllForums = async (search?: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/forum/get-all-forums`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: {
				search
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getForumCategories = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/forum/get-forums-categories`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}


export const getAllProductsListing = async (searchObject?: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/products/get-all-product`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: {
				searchObject
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getUserProducts = async (searchObject?: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/products/get-user-product`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: {
				searchObject
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getSingleProduct = async (id: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/products/getSingleProduct/${id}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteProductImage = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/products/deleteProductImage`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteProduct = async (id: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/products/deleteProduct/${id}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const addUpdateProductDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/products/add-update-product-details`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary = ${data._boundary} `,
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getProductCategories = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/products/get-product-categories`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}
export const addOrRemoveFileToFavorite = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/addOrRemoveFileToFavorite`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const checkIsFavoriteFile = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/check-favorite-file`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteUserFile = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/deleteUserFile`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFavoriteFiles = async (id: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/getFavoriteFiles/${id}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFileDetails = async (id: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/getFileDetails/${id}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const createFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/createFolder`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const getFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	try {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/getFoldersByUserId/${data.userId}`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: {
				parentFolderId: data.folderId
			}
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching folder data:', error);
		throw error;
	}
};


export const updateFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/updateFolder/${data.folderId}`,
			method: 'put',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};
export const deleteFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/deleteFolder`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFileTypes = async (userId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/getFileTypes/${userId}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFilesWithParams = async (search?: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/getFilesWithParams`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			params: {
				search
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const downloadZipFile = async (folderId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	try {
		const response = await axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/downloadFolder/${folderId}`,
			method: 'get',
			responseType: 'blob', // Important to handle binary data
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error downloading zip file:', error);
		throw error;
	}
};

export const RecoverFolder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/recoverFolder/${data.folderId}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const RecoverFile = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/recoverFile/${data.fileId}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteFolderPermanently = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/deleteFolderPermanently`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteFilePermanently = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/deleteFilePermanently`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const GetRecycledFilesAndFolders = async (userId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/recycledFilesAndFolder/${userId}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getFilesByFolder = async (folderId: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/getFilesByFolder/${folderId}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const fileUpload = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/uploadFile`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': `multipart/form-data; boundary = ${data._boundary} `,
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getListOfContributors = async (id: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/common/fileManager/getListOfContributors/${id}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getUserActivities = async (id: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/user/getUserActivities/${id}`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});

};
export const getAllUsersStudyBuddy = async (query: any = {}): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/common/user/getAllUsersStudyBuddy`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			params: query
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

