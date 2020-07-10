const Sequelize = require('sequelize');

const User = require('../app/models/User');
const Student = require('../app/models/Student');
const Plan = require('../app/models/Plan');
const Registration = require('../app/models/Registration');
const Checkin = require('../app/models/Checkin');
const HelpOrder = require('../app/models/HelpOrder');

const configDatabase = require('../config/configDatabase');

const models = [User, Student, Plan, Registration, Checkin, HelpOrder];

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
