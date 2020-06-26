const Student = require('../models/Student');

module.exports = {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
      order: [['id', 'desc']],
    });

    return res.json(students);
  },
  async show(req, res) {
    const { id } = req.params;

    const studentExists = await Student.findByPk(id);

    if (!studentExists) {
      res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const { name, email, age, weight, height } = studentExists;

    return res.json({ id, name, email, age, weight, height });
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
  async update(req, res) {
    const { id } = req.params;
    const { email } = req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      res.status(404).json({ error: 'Aluno não encontrado' });
    }

    if (email && email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res.status(400).json({
          error: `O email ${email} já está sendo utilizado por outro aluno`,
        });
      }
    }

    const {
      name,
      email: studentEmail,
      age,
      weight,
      height,
    } = await student.update(req.body);

    return res.json({
      id,
      name,
      email: studentEmail,
      age,
      weight,
      height,
    });
  },
};
