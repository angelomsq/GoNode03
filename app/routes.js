const express = require('express');

const routes = express.Router();

const requireDir = require('require-dir');

const controllers = requireDir('./controllers');

// console.log(controllers);

const authMiddleware = require('./middlewares/authMiddleware');

// const authController = require('./controllers/authController');
// const dashboardController = require('./controllers/dashboardController');
// const projectController = require('./controllers/projectController');
// const sectionController = require('./controllers/sectionController');

/**
 * Auth Routes
 */

routes.post('/register', controllers.authController.register);
routes.post('/authenticate', controllers.authController.authenticate);

/** ===============================
 * AUTHETICATED ROUTES AFTER HERE *
 ================================ */

routes.use(authMiddleware);

/**
 * User Routes
 */

routes.put('/users', controllers.userController.update);
routes.get('/users/account', controllers.userController.account);
routes.post('/users/:id/addfriend', controllers.userController.addFriend);
routes.post('/users/:id/removefriend', controllers.userController.removeFriend);
routes.get('/feed', controllers.userController.feed);

/**
 * Post Routes
 */

routes.post('/posts/create', controllers.postController.create);
routes.delete('/posts/:id', controllers.postController.destroy);
routes.post('/posts/:id/like', controllers.postController.like);

/**
 * Comment Routes
 */

routes.post('/posts/:id/comments/create', controllers.commentController.create);
routes.delete('/comments/:id', controllers.commentController.destroy);
routes.post('/comments/:id/like', controllers.commentController.like);

module.exports = routes;
