const { Project, Section } = require('../models');

module.exports = {
  async store(req, res, next) {
    try {
      const { projectId } = req.params;
      const section = await Section.create({
        ...req.body,
        ProjectId: projectId,
      });
      req.flash('success', 'Seção Criada com Sucesso!');
      return res.redirect(`/app/projects/${projectId}/sections/${section.id}`);
    } catch (err) {
      return next(err);
    }
  },

  async show(req, res, next) {
    try {
      const { projectId, id } = req.params;
      const { user } = req.session;
      const project = await Project.findById(projectId);
      const section = await Section.findById(id);

      const sections = await Section.findAll({
        where: { ProjectId: projectId },
      });

      return res.render('sections/show', {
        user,
        project,
        sections,
        currentSection: section,
      });
    } catch (err) {
      return next(err);
    }
  },
  async update(req, res, next) {
    try {
      const { projectId, id } = req.params;
      const section = await Section.findById(id);

      await section.update(req.body);

      req.flash('success', 'Seção Atualizada com Sucesso!');

      return res.redirect(`/app/projects/${projectId}/sections/${section.id}`);
    } catch (err) {
      return next(err);
    }
  },

  async destroy(req, res, next) {
    try {
      const { projectId, id } = req.params;
      await Section.destroy({ where: { id } });

      req.flash('success', 'Seção Removida com Sucesso!');
      return res.redirect(`/app/projects/${projectId}`);
    } catch (err) {
      return next(err);
    }
  },
};
