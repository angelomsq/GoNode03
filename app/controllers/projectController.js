const { Project, Section } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      const { user } = req.session;
      const project = await Project.create({
        ...req.body,
        UserId: user.id,
      });
      req.flash('success', 'Projeto Criado com Sucesso!');
      return res.redirect(`/app/projects/${project.id}`);
    } catch (err) {
      return next(err);
    }
  },

  async show(req, res, next) {
    try {
      const { user } = req.session;
      const { id } = req.params;
      const project = await Project.findById(id);
      const sections = await Section.findAll({
        where: { ProjectId: id },
      });
      return res.render('projects/show', {
        user,
        project,
        sections,
      });
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const { id } = req.params;
      await Project.destroy({ where: { id } });

      req.flash('success', 'Projeto Removido com Sucesso!');
      return res.redirect('/app/dashboard');
    } catch (err) {
      return next(err);
    }
  },
};
