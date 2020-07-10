/* eslint-disable camelcase */
const Yup = require('yup');
const HelpOrder = require('../models/HelpOrder');
const Student = require('../models/Student');
const AnswerMail = require('../jobs/AnswerMail');
const Queue = require('../../lib/Queue');

class AnswerController {
  async store(req, res) {
    try {
      /**
       * início validação
       */
      const schemaParams = Yup.object().shape({
        id: Yup.number().required().positive(),
      });

      if (!(await schemaParams.isValid(req.params))) {
        return res.json({ error: 'Falha na validação' });
      }

      const schemaBody = Yup.object().shape({
        answer: Yup.string().required(),
      });

      if (!(await schemaBody.isValid(req.body))) {
        return res.json({ error: 'Falha na validação' });
      }
      /**
       * fim validação
       */

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

      if (!helpOrder)
        return res.status(400).json({ error: 'Pergunta inexistente' });

      if (helpOrder.answer_at !== null) {
        return res.status(400).json({ error: 'Pergunta já respondida' });
      }

      const helpOrderAnswer = await helpOrder.update({ answer, answer_at });

      // enviar email
      await Queue.add(AnswerMail.key, {
        helpOrder,
      });

      return res.json(helpOrderAnswer);
    } catch (error) {
      return res.json(error);
    }
  }
}
module.exports = new AnswerController();
