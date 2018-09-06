const mongoose = require('mongoose');

const User = mongoose.model('User');
const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');
module.exports = {
  async update(req, res, next) {
    try {
      const {
        username, name, password, confirmPassword,
      } = req.body;

      if (name.length === 0) {
        return res.status(400).json({
          error: 'The Name field is empty, it is a required field and must be filled in.',
        });
      }

      if (username.length === 0) {
        return res.status(400).json({
          error: 'The Username field is empty, it is a required field and must be filled in.',
        });
      }

      if (password && password !== confirmPassword) {
        return res.status(400).json({
          error: "Password doesn't match",
        });
      }

      const user = await User.findOne({ _id: req.userId });

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      user.name = name;
      user.username = username;

      if (password) user.password = password;

      await user.save();

      return res.json(user);
    } catch (err) {
      return next(err);
    }
  },

  async account(req, res, next) {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      const postCount = await Post.find({ user: user.id }).count();
      const commentCount = await Comment.find({ user: user.id }).count();
      const friendsCount = user.friends.length;

      return res.json({
        user,
        postCount,
        commentCount,
        friendsCount,
      });
    } catch (err) {
      return next(err);
    }
  },

  async feed(req, res, next) {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      const { friends } = user;

      const posts = await Post.find({ user: { $in: [user.id, ...friends] } })
        .limit(50)
        .sort('-createdAt');

      return res.json(posts);
    } catch (err) {
      return next(err);
    }
  },

  async addFriend(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      if (user.friends.indexOf(req.userId) !== -1) {
        return res.status(400).json({ error: `You and ${user.username} are already friends` });
      }

      user.friends.push(req.userId);
      await user.save();

      const me = await User.findById(req.userId);
      me.friends.push(user.id);
      await me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },

  async removeFriend(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      const friendship = user.friends.indexOf(req.userId);

      if (friendship === -1) {
        return res.status(400).json({ error: `You and ${user.username} are not friends.` });
      }

      user.friends.splice(friendship, 1);
      await user.save();

      const me = await User.findById(req.userId);
      const myFriendship = me.friends.indexOf(user.id);
      me.friends.splice(myFriendship, 1);
      await me.save();

      return res.json(me);
    } catch (err) {
      return next(err);
    }
  },
};
