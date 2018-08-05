const { Project, Section } = require('../models');

module.exports = {
  async index(req, res, next) {
    try {
      const { user } = req.session;
      const projects = await Project.findAll({
        include: [Section],
        where: { UserId: user.id },
      });
      return res.render('dashboard/index', { projects, user });
    } catch (err) {
      return next(err);
    }
  },
};
