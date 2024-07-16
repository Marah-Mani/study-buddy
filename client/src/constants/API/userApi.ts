export const USER = {
    profile: {
        updateProfileDetails: '/user/profile/update-profile-details',
        updatePassword: (userId: string) => `/user/profile/update-password/${userId}`,
        uploadDigitalSignature: '/user/profile/upload-signature',
        uploadIdentityDocuments: '/user/profile/upload-user-documents',
        getUserDocuments: '/user/profile/get-user-documents',
        deleteUserDocument: '/user/profile/delete-user-documents',
        lastSeenUserDate: (userId: string) => `/user/profile/lastSeenUser/${userId}`
    }
};
