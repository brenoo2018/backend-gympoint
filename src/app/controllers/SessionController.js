const jwt = require('jsonwebtoken');
const Yup = require('yup');

const User = require('../models/User');
const authConfig = require('../../config/authConfig');

module.exports = {
  async store(req, res) {
    /**
     * Início validação
     */

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    /**
     * Fim validação
     */
    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!(await userExists.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const { id, name } = userExists;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  },
};
