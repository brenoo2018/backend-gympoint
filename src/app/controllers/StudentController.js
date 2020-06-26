const Student = require('../models/Student');

module.exports = {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
      order: [['id', 'desc']],
    });

    return res.json(students);
  },
  async store(req, res) {
    const { email } = req.body;

    const studentExists = await Student.findOne({ where: { email } });

    if (studentExists) {
      return res.status(400).json({ error: 'Aluno já cadastrado' });
    }

    const { id, age, name, weight, height } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  },
};
