const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
module.exports = {
  async create(req, res, next) {
    try {
      const { content } = req.body;
      const post = req.params.id;

      if (content.length === 0) {
        return res.status(400).json({
          error: 'The Content field is empty, it is a required field and must be filled in.',
        });
      }

      if (post.length === 0) {
        return res.status(400).json({
          error: 'PostID not informed.',
        });
      }

      if (!(await Post.findById(post))) {
        return res.status(400).json({ error: 'Post not found.' });
      }

      const comment = await Comment.create({ ...req.body, post, user: req.userId });
      return res.json(comment);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      if (await Comment.findByIdAndRemove(req.params.id)) {
        return res.json({ res: 'Comment Deleted with success.' });
      }
      return res.status(400).json({ error: 'Comment not found.' });
    } catch (err) {
      return next(err);
    }
  },

  async like(req, res, next) {
    try {
      const commentId = req.params.id;

      if (commentId.length === 0) {
        return res.status(400).json({
          error: 'Comment ID not informed.',
        });
      }

      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(400).json({ error: 'Comment not found.' });
      }

      const liked = comment.likes.indexOf(req.userId);

      if (liked === -1) {
        comment.likes.push(req.userId);
      } else {
        comment.likes.splice(liked, 1);
      }

      await comment.save();

      return res.json(comment);
    } catch (err) {
      return next(err);
    }
  },
};
