const bcrypt = require('bcryptjs');
const { User } = require('../models');

module.exports = {
  signin(req, res) {
    res.render('auth/signin');
  },

  signup(req, res) {
    res.render('auth/signup');
  },

  signout(req, res) {
    return req.session.destroy(() => {
      res.redirect('/');
    });
  },

  async register(req, res, next) {
    try {
      const { email, name } = req.body;

      if (name.length === 0) {
        req.flash('error', 'Preencha seu Nome.');
        return res.redirect('back');
      }

      if (email.length === 0) {
        req.flash('error', 'Preencha seu E-mail.');
        return res.redirect('back');
      }

      if (await User.findOne({ where: { email } })) {
        req.flash('error', 'E-mail já cadastrado.');
        return res.redirect('back');
      }

      const password = await bcrypt.hash(req.body.password, 5);

      await User.create({ ...req.body, password });
      req.flash('success', 'Usuário cadastrado com sucesso!');
      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  },

  async authenticate(req, res, next) {
    try {
      const { email, password } = req.body;

      if (email.length === 0) {
        req.flash('error', 'Preencha seu E-mail.');
        return res.redirect('back');
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        req.flash('error', 'Usuário inexistente');
        return res.redirect('back');
      }

      if (!(await bcrypt.compare(password, user.password))) {
        req.flash('error', 'Senha incorreta');
        return res.redirect('back');
      }

      req.session.user = user;
      return req.session.save(() => {
        res.redirect('/app/dashboard');
      });
    } catch (err) {
      return next(err);
    }
  },
};
