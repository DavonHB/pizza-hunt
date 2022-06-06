const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');

router
.route('/:pizzaId/:commentId')
.put(addReply)
.delete(removeComment);

router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;