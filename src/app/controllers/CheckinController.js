/* eslint-disable camelcase */
const { Op } = require('sequelize');
const { startOfDay, endOfDay, subDays } = require('date-fns');
const Yup = require('yup');

const Checkin = require('../models/Checkin');
const Student = require('../models/Student');

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.json({ error: 'Aluno não encontrado' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id },
      attributes: ['id', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email', 'age', 'weight', 'height'],
        },
      ],
    });

    if (!checkins) {
      return res.json({ error: 'Checkins não encontrados' });
    }

    return res.json(checkins);
  }

  async store(req, res) {
    try {
      /**
       * início validação
       */
      const schemaParams = Yup.object().shape({
        student_id: Yup.number().positive().required(),
      });

      if (!(await schemaParams.isValid(req.params))) {
        return res.json({ error: 'Falha na validação' });
      }
      /**
       * fim validação
       */

      const { student_id } = req.params;

      const studentExists = await Student.findByPk(student_id);

      if (!studentExists) {
        return res.json({ error: 'Aluno não encontrado' });
      }

      const today = Number(new Date());
      const startDate = Number(subDays(today, 7));
      const lastCheckins = await Checkin.findAll({
        where: {
          student_id,
          created_at: {
            [Op.between]: [startOfDay(startDate), endOfDay(today)],
          },
        },
      });

      if (lastCheckins && lastCheckins.length >= 5)
        return res.status(401).json({
          error: 'Você só pode fazer 5 checkins no período de 7 dias',
        });

      const checkin = await Checkin.create({ student_id });

      return res.json(checkin);
    } catch (error) {
      return res.json(error);
    }
  }
}

module.exports = new CheckinController();
