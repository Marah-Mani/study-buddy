const express = require('express');
const router = express.Router();
const forumController = require('../../controllers/frontend/forumController');

router.get('/single/:slug', forumController.getSingleForum);
router.post('/submit-comment', forumController.submitForumComment);
router.post('/submit-vote', forumController.submitForumVote);
router.post('/submit-reply', forumController.submitForumReply);
router.post('/forum-views', forumController.forumQuestionViews);
router.get('/related-forums/:id', forumController.getRelatedForums);
router.post('/delete', forumController.deleteComment);

module.exports = router;
