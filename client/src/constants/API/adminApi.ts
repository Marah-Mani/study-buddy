export const ADMIN = {
    blog: {
        getAllBlogs: `/admin/blogs`,
        addUpdateBlogDetails: `/admin/blogs/addUpdateBlogDetails`,
        deleteBlog: `/admin/blogs/deleteBlog`,
    },
    author: {
        getAllAuthors: `/admin/authors`,
        deleteAuthor: `/admin/authors/deleteAuthor`,
        updateAuthor: `/admin/authors/addUpdateAuthorDetails`,
    },
    setting: {
        updateBrandDetails: `/admin/settings/update-brand-details`,
        getSingleBrandDetails: `/admin/settings/single-brand-details`,
        deleteBrandLogo: `/admin/settings/delete-brand-logo`,
        updatePaymentDetails: `/admin/settings/update-payment-details`,
        updateSEODetails: `/admin/settings/update-seo-details`,
        updateSocialLinks: `/admin/settings/update-social-links`,
        updateSignature: `/admin/settings/update-email-signature`,
        addUpdateHeaderData: `/admin/settings/update-header-menu`,
        getHeaderMenus: '/admin/settings/get-header-menu',
        updateOrderOfMenu: '/admin/settings/update-menu-order',
        addUpdateFooterData: `/admin/settings/update-footer-menu`,
        getFooterMenus: `/admin/settings/get-footer-menu`,
        deleteHeaderMenu: `/admin/settings/delete-header-menu`,
        updateEmailTemplate: `/admin/settings/update-email-template`,
        getAllEmailTemplates: `/admin/settings/get-all-templates`,
        deleteFooterMenu: `/admin/settings/delete-footer-menu`,
        getAllChatSettings: `/admin/settings/get-chat-setting`,
        updateChatSettings: `/admin/settings/update-chat-setting`,
    },
    profile: {
        updateProfileDetails: `/admin/profile/update-profile-details`,
        updatePassword: (userId: string) => `/admin/profile/update-password/${userId}`,
    },
    dashboard: {
        saveStickyNote: `/admin/dashboard/save-sticky-note`,
        deleteStickyNote: `/admin/dashboard/save-sticky-note`,
        getAllUsers: '/admin/users',
    },
    role: {
        getAllRoles: `/admin/roles`,
        addUpdateRoleDetails: `/admin/roles/add-Update-Role-Details`,
        deleteRole: '/admin/roles/delete-Role',
    },
    user: {
        addUpdateUser: '/admin/users/addUpdateUser',
        deleteUser: `/admin/users/deleteUser`,
    },
    contactUs: {
        getAllContactUs: '/admin/contactus',
        deleteContactUs: '/admin/contactus/deleteContactUs',
    },
    documentation: {
        addUpdateKnowledgeBase: `/admin/documentations/add-update-knowledge-base`,
        getKnowledgeBase: `/admin/documentations/get-knowledge-base`,
        updateKnowledgeBaseOrder: `/admin/documentations/update-knowledge-base-order`,
        deleteKnowledgeBase: `/admin/documentations/delete-knowledge-base`,
        getAllDocumentations: `/admin/documentations/get-all-documentations`,
        getReceipt: `/admin/invoice`,
    }
}
