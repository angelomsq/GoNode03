const mongoose = require('mongoose');

const Post = mongoose.model('Post');
module.exports = {
  async create(req, res, next) {
    try {
      const { content } = req.body;

      if (content.length === 0) {
        return res.status(400).json({
          error: 'The Content field is empty, it is a required field and must be filled in.',
        });
      }

      const post = await Post.create({ ...req.body, user: req.userId });
      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      if (await Post.findByIdAndRemove(req.params.id)) {
        return res.json({ res: 'Post Deleted with success.' });
      }
      return res.status(400).json({ error: 'Post not found.' });
    } catch (err) {
      return next(err);
    }
  },

  async like(req, res, next) {
    try {
      const postId = req.params.id;

      if (postId.length === 0) {
        return res.status(400).json({
          error: 'Post ID not informed.',
        });
      }

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(400).json({ error: 'Post not found.' });
      }

      const liked = post.likes.indexOf(req.userId);

      if (liked === -1) {
        post.likes.push(req.userId);
      } else {
        post.likes.splice(liked, 1);
      }

      await post.save();

      return res.json(post);
    } catch (err) {
      return next(err);
    }
  },
};
