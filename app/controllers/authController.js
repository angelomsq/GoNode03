const mongoose = require('mongoose');

const User = mongoose.model('User');

const sendMail = require('../services/mailer');

module.exports = {
  async register(req, res, next) {
    try {
      const { email, username, name } = req.body;

      if (name.length === 0) {
        return res.status(400).json({
          error: 'The Name field is empty, it is a required field and must be filled in.',
        });
      }

      if (email.length === 0) {
        return res.status(400).json({
          error: 'The E-Mail field is empty, it is a required field and must be filled in.',
        });
      }

      if (await User.findOne({ $or: [{ email }, { username }] })) {
        return res.status(400).json({ error: 'A User already exists with this credentials.' });
      }

      const user = await User.create(req.body);

      sendMail({
        from: 'Angelo Queiroz <contato@angeloqueiroz.com>',
        to: user.email,
        subject: `Bem-vindo ao FaceClone, ${user.name}`,
        template: 'auth/register',
        context: {
          header: `Seja Bem-vindo ${user.name}, agredecemos por ter efetuado cadastro conosco.`,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      });

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (err) {
      return next(err);
    }
  },

  async authenticate(req, res, next) {
    try {
      const { email, password } = req.body;

      if (email.length === 0) {
        return res.status(400).json({
          error: 'The E-Mail field is empty, it is a required field and must be filled in.',
        });
      }

      if (password.length === 0) {
        return res.status(400).json({
          error: 'The Password field is empty, it is a required field and must be filled in.',
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(400).json({ error: 'Invalid password.' });
      }

      return res.json({
        user,
        token: user.generateToken(),
      });
    } catch (err) {
      return next(err);
    }
  },
};
