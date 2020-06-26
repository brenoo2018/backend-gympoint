const { Router } = require('express');

const SessionController = require('./app/controllers/SessionController');
const StudentController = require('./app/controllers/StudentController');
const authMiddleware = require('./app/middlewares/authMiddleware');

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.get('/students/:id', StudentController.show);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

module.exports = routes;
