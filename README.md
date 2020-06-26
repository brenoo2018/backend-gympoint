<h2 align="center">
Desafio: GYMPOINT
<p align="center"> API para gerenciamento de academia</p>
</h2>

### Ferramentas utilizadas:
- Express;
- Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (com PostgreSQL);
- Yup (validação de dados)
-  JWT

### Funcionalidades :
##### 1.  Autenticação
- Permite que um usuário se autentique em sua aplicação utilizando e-mail e uma senha.

- Esse primeiro usuário, por ser um administrador único, foi criado utilizando um seed.

- Com o usuário administrador na sua base de dados, utilize esse usuário para todos logins.

- A autenticação feita utilizando JWT com validação dos dados de entrada;

##### 2.  Cadastro de alunos
- Alunos são mantidos (cadastrados/atualizados) na aplicação utilizando nome, email, idade, peso e altura.

- O cadastro de alunos só pode ser feito por administradores autenticados na aplicação.

- O aluno não pode se autenticar no sistema, ou seja, não possui senha.

## Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
