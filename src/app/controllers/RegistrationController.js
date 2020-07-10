/* eslint-disable camelcase */
const { parseISO, addMonths } = require('date-fns');
const Yup = require('yup');
const Registration = require('../models/Registration');
const Student = require('../models/Student');
const Plan = require('../models/Plan');
const RegistrationMail = require('../jobs/RegistrationMail');
const Queue = require('../../lib/Queue');

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: [
        'start_date',
        'end_date',
        'student_id',
        'plan_id',
        'total_price',
      ],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email', 'age', 'weight', 'height'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title', 'duration'],
        },
      ],
    });

    return res.json(registrations);
  }

  async store(req, res) {
    /**
     * início validação
     */
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    /**
     * fim validação
     */
    const { student_id, plan_id, start_date } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(404).json({ error: 'Plano não encontrado' });
    }

    const { duration, price } = planExists;

    const registrationPrice = duration * price;
    const initDate = parseISO(start_date);
    const finalDate = addMonths(initDate, duration);

    const registration = await Registration.create({
      start_date: initDate,
      end_date: finalDate,
      student_id,
      plan_id,
      total_price: registrationPrice,
    });

    // envio do email
    await Queue.add(RegistrationMail.key, {
      registration,
      student: studentExists,
      plan: planExists,
    });

    return res.json(registration);
  }

  async update(req, res) {
    /**
     * início validação
     */
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }
    /**
     * fim validação
     */

    const { id } = req.params;

    const registrationExists = await Registration.findByPk(id);

    if (!registrationExists) {
      return res.status(400).json({ error: 'Matrícula não encontrada' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não encontrado' });
    }
    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ error: 'Plano não encontrado' });
    }

    const { duration, price } = planExists;

    const registrationPrice = duration * price;
    const initDate = parseISO(start_date);
    const finshDate = addMonths(initDate, duration);

    const { id: idRegister } = registrationExists.update({
      start_date: initDate,
      end_date: finshDate,
      student_id,
      plan_id,
      total_price: registrationPrice,
    });

    return res.json({
      id: idRegister,
      start_date: initDate,
      end_date: finshDate,
      student_id,
      plan_id,
      total_price: registrationPrice,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      res.status(404).json({ error: 'Matrícula não encontrada' });
    }

    registration.destroy();

    return res.status(200).json({ message: 'Registro deletado com sucesso' });
  }
}

module.exports = new RegistrationController();
