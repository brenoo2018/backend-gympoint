const { Router } = require('express');

const SessionController = require('./app/controllers/SessionController');
const StudentController = require('./app/controllers/StudentController');
const authMiddleware = require('./app/middlewares/authMiddleware');

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);

module.exports = routes;
