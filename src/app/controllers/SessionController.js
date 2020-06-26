const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../../config/authConfig');

module.exports = {
  async store(req, res) {
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
