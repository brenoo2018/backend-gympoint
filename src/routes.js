const { Router } = require('express');

const SessionController = require('./app/controllers/SessionController');
const StudentController = require('./app/controllers/StudentController');
const PlanController = require('./app/controllers/PlanController');
const RegistrationController = require('./app/controllers/RegistrationController');
const CheckinController = require('./app/controllers/CheckinController');
const HelpOrderController = require('./app/controllers/HelpOrderController');
const AnswerController = require('./app/controllers/AnswerController');

const authMiddleware = require('./app/middlewares/authMiddleware');

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/plans', PlanController.index);

routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);

routes.get('/help-orders', HelpOrderController.index);
routes.post('/help-orders/:id', AnswerController.store);
routes.get('/students/:student_id/help-orders', HelpOrderController.show);
routes.post('/students/:student_id/help-orders', HelpOrderController.store);

routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.get('/students/:id', StudentController.show);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.get('/registrations', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.delete);

routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

module.exports = routes;
