import axios from 'axios';
import Cookies from 'js-cookie';

export const updateProfileDetails = async (formData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const token = Cookies.get('session_token');
        const req = axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/user/profile/update-profile-details`, formData, {
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

export const updatePassword = async (userId: any, updatedData: any) => {
    try {
        const token = Cookies.get('session_token');
        const res = await axios.put(
            `${process.env['NEXT_PUBLIC_API_URL']}/user/profile/update-password/${userId}`,
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

export const uploadIdentityDocuments = async (formData: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const token = Cookies.get('session_token');
        const req = axios.post(`${process.env['NEXT_PUBLIC_API_URL']}/user/profile/upload-user-documents`, formData, {
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

export const getUserDocuments = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/profile/get-user-documents`,
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

export const deleteUserDocument = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/profile/delete-user-documents`,
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

export const uploadDigitalSignature = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${process.env['NEXT_PUBLIC_API_URL']}/user/profile/upload-signature`,
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

export const lastSeenUserDate = async (userId: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/profile/lastSeenUser/${userId}`,
            method: 'post',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token} `
            },
        });
        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};
export const createFolder = async (data: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/createFolder`,
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/getFoldersByUserId/${data.userId}`, {
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/updateFolder/${data.folderId}`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/deleteFolder`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/getFileTypes/${userId}`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/getFilesWithParams`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/downloadFolder/${folderId}`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/recoverFolder/${data.folderId}`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/recoverFile/${data.fileId}`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/deleteFolderPermanently`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/deleteFilePermanently`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/recycledFilesAndFolder/${userId}`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/getFilesByFolder/${folderId}`,
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
            url: `${process.env.NEXT_PUBLIC_API_URL}/user/fileManager/uploadFile`,
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

export const getDashboardData = async (id: any): Promise<any> => {
    const token = Cookies.get('session_token');
    return new Promise((resolve, reject) => {
        const req = axios.request({
            url: `${process.env['NEXT_PUBLIC_API_URL']}/user/dashboard/getDashboardData/${id}`,
            method: 'get',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        req.then((res) => resolve(res.data)).catch((err) => reject(err));
    });
};
