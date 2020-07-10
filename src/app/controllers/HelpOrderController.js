/* eslint-disable camelcase */
const Yup = require('yup');
const HelpOrder = require('../models/HelpOrder');
const Student = require('../models/Student');

class HelpOrdersController {
  async index(req, res) {
    const helpOrdersNoAnswer = await HelpOrder.findAll({
      where: { answer_at: null },
      attributes: ['id', 'question', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email', 'age', 'weight', 'height'],
        },
      ],
    });

    return res.json(helpOrdersNoAnswer);
  }

  async show(req, res) {
    const { student_id } = req.params;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.json({ error: 'Aluno não encontrado' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: { student_id },
      order: [['created_at', 'desc']],
      attributes: ['id', 'question', 'answer', 'answer_at'],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Falha na validação' });
    }

    const { student_id } = req.params;
    const { question } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.json({ error: 'Aluno não encontrado' });
    }

    const helpOrder = await HelpOrder.create({ student_id, question });

    return res.json(helpOrder);
  }
}

module.exports = new HelpOrdersController();
