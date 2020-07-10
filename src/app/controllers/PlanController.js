const Yup = require('yup');
const Plan = require('../models/Plan');

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    // validação

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required().integer().positive(),
      price: Yup.number().required().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    // fim validação

    const { title, duration, price } = await Plan.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    // validação

    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number().integer().positive(),
      price: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    // fim validação

    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      res.status(404).json({ error: 'Plano não encontrado' });
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.json({
      title,
      duration,
      price,
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      res.status(404).json({ error: 'Plano não encontrado' });
    }

    plan.destroy();

    return res.status(200).json({ message: 'Registro deletado com sucesso' });
  }
}
module.exports = new PlanController();
