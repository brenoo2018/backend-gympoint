/* eslint-disable camelcase */
const Yup = require('yup');
const HelpOrder = require('../models/HelpOrder');
const Student = require('../models/Student');
const AnswerMail = require('../jobs/AnswerMail');
const Queue = require('../../lib/Queue');

class AnswerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Falha na validação' });
    }

    const { id } = req.params;
    const { answer } = req.body;
    const answer_at = new Date();

    const helpOrder = await HelpOrder.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!helpOrder || helpOrder.answer_at !== null)
      return res.status(400).json({ error: 'Pergunta já respondida' });

    const helpOrderAnswer = await helpOrder.update({ answer, answer_at });

    // enviar email
    await Queue.add(AnswerMail.key, {
      helpOrder,
    });

    return res.json(helpOrderAnswer);
  }
}
module.exports = new AnswerController();
