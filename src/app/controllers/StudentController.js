const Yup = require('yup');
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
    try {
      // validação

      const schemaParams = Yup.object().shape({
        id: Yup.number().positive().required(),
      });

      if (!(await schemaParams.isValid(req.params))) {
        return res.json({ error: 'Falha na validação' });
      }
      // fim validação
      const { id } = req.params;

      const studentExists = await Student.findByPk(id);

      if (!studentExists) {
        res.status(404).json({ error: 'Aluno não encontrado' });
      }

      const { name, email, age, weight, height } = studentExists;

      return res.json({ id, name, email, age, weight, height });
    } catch (error) {
      return res.json(error);
    }
  },
  async store(req, res) {
    try {
      /**
       * Início validação
       */

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        age: Yup.number().integer().positive().required(),
        weight: Yup.number().positive().required(),
        height: Yup.number().positive().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação' });
      }

      /**
       * Fim validação
       */
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
    } catch (error) {
      return res.json(error);
    }
  },
  async update(req, res) {
    try {
      /**
       * Início validação
       */

      const schemaParams = Yup.object().shape({
        id: Yup.number().positive().required(),
      });

      if (!(await schemaParams.isValid(req.params))) {
        return res.json({ error: 'Falha na validação' });
      }

      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        age: Yup.number().integer().positive(),
        weight: Yup.number().positive(),
        height: Yup.number().positive(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação' });
      }

      /**
       * Fim validação
       */
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
    } catch (error) {
      return res.json(error);
    }
  },
  async delete(req, res) {
    try {
      // validação

      const schemaParams = Yup.object().shape({
        id: Yup.number().positive().required(),
      });

      if (!(await schemaParams.isValid(req.params))) {
        return res.json({ error: 'Falha na validação' });
      }
      // fim validação
      const { id } = req.params;

      const studentExists = await Student.findByPk(id);

      if (!studentExists) {
        res.status(404).json({ error: 'Aluno não encontrado' });
      }

      await Student.destroy({ where: { id } });

      return res.status(200).json({ message: 'Registro deletado com sucesso' });
    } catch (error) {
      return res.json(error);
    }
  },
};
