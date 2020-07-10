const Sequelize = require('sequelize');

const User = require('../app/models/User');
const Student = require('../app/models/Student');
const Plan = require('../app/models/Plan');
const Registration = require('../app/models/Registration');

const configDatabase = require('../config/configDatabase');

const models = [User, Student, Plan, Registration];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

module.exports = new Database();
