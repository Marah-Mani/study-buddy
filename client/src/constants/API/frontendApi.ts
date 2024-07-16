export const FRONTEND = {
	blog: {
		upload: '/upload',
		blogs: '/blogs',
		singleBlog: (slug: string) => `/blogs/single/${slug}`,
		blogViews: '/blogs/blogViews',
	},
	other: {
		contactUs: '/contactUs',
		headerMenus: '/menus/header',
		singleKnowledgeBase: (id: string) => `/knowledgeBase/single/${id}`,
	},
	forum: {
		singleForum: (slug: string) => `/forums/single/${slug}`,
		submitForumComment: '/forums/submit-comment',
		submitForumVote: '/forums/submit-vote',
		submitForumReply: '/forums/submit-reply',
		forumQuestionViews: '/forums/forum-views',
		relatedForums: (id: string) => `/forums/related-forums/${id}`,
		deleteComment: '/forums/delete'
	}
};
