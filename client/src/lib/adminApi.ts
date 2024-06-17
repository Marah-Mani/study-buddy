import axios from 'axios';
import Cookies from 'js-cookie';

export const getAllBlogs = async (searchTerm: string = ''): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/blogs`,
			method: 'get',
			params: {
				searchTerm: searchTerm
			},
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const addUpdateBlogDetails = async (formData: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/admin/blogs/addUpdateBlogDetails`, formData, {
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

export const deleteBlog = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/blogs/deleteBlog`,
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

export const getAllAuthors = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/authors`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteAuthor = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/authors/deleteAuthor`,
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

export const updateAuthor = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/authors/addUpdateAuthorDetails`,
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

export const updateBrandDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-brand-details`,
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

export const getSingleBrandDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/single-brand-details`,
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

export const deleteBrandLogo = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/delete-brand-logo`,
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

export const updatePaymentDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-payment-details`,
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

export const updateSEODetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-seo-details`,
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

export const updateSocialLinks = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-social-links`,
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

export const updateSignature = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-email-signature`,
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

export const updateProfileDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/profile/update-profile-details`,
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

export const updatePassword = async (userId: any, updatedData: any) => {
	try {
		const token = Cookies.get('session_token');
		const res = await axios.put(
			`${process.env['NEXT_PUBLIC_API_URL']}/admin/profile/update-password/${userId}`,
			updatedData,
			{
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		);
		return res.data;
	} catch (err) {
		throw err;
	}
};

export const saveStickyNote = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/save-sticky-note`,
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

export const deleteStickyNote = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/save-sticky-note`,
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


export const getAllRoles = async (search?: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/roles`,
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

export const addUpdateRoleDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/admin/roles/add-Update-Role-Details`, data, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteRole = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/roles/delete-Role`,
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


export const addUpdateUser = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/users/addUpdateUser`,
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

export const deleteUser = async (id: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/users/deleteUser/${id}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const updateEmailTemplate = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-email-template`,
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

export const getAllEmailTemplates = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/settings/get-all-templates`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllContactUs = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/contactus`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const deleteContactUs = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/contactus/deleteContactUs`,
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



export const addUpdateHeaderData = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-header-menu`,
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

export const getHeaderMenus = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/get-header-menu`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const updateOrderOfMenu = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-menu-order`,
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


export const addUpdateFooterData = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/update-footer-menu`,
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

export const getFooterMenus = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/get-footer-menu`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token} `
			},
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};


export const deleteHeaderMenu = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/delete-header-menu`,
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

export const deleteFooterMenu = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/settings/delete-footer-menu`,
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

export const addUpdateKnowledgeBase = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/documentations/add-update-knowledge-base`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			data
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getKnowledgeBase = async (search?: string): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/documentations/get-knowledge-base`,
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


export const updateKnowledgeBaseOrder = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/documentations/update-knowledge-base-order`,
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

export const deleteKnowledgeBase = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/documentations/delete-knowledge-base`,
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

export const getAllDocumentations = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/documentations/get-all-documentations`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
};

export const getReceipt = async (): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/invoice`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}


export const addUpdateProductDetails = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/products/add-update-product-details`,
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
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/products/get-product-categories`,
			method: 'get',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	})
}

export const getAllProducts = async (search?: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/products/get-all-product`,
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

export const getSingleProduct = async (id: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/products/getSingleProduct/${id}`,
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
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/products/deleteProductImage`,
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
			url: `${process.env['NEXT_PUBLIC_API_URL']}/admin/products/deleteProduct/${id}`,
			method: 'post',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		});

		req.then((res) => resolve(res.data)).catch((err) => reject(err));
	});
};

export const getAllUsers = async (search?: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/users`,
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

export const updateUserStatus = async (data: any): Promise<any> => {
	const token = Cookies.get('session_token');
	return new Promise((resolve, reject) => {
		const req = axios.request({
			url: `${process.env.NEXT_PUBLIC_API_URL}/admin/users/updateUserStatus`,
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
