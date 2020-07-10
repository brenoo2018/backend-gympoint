<h2 align="center">
Desafio: GYMPOINT
<p align="center"> API para gerenciamento de academias</p>
</h2>

### Ferramentas utilizadas:
- Express;
- Nodemon;
- ESLint + Prettier + EditorConfig;
- Sequelize (com PostgreSQL);
- Yup (validação de dados)
-  JWT (autenticação)
- Nodemailer (envio de emails)
- Bee-Queue + Redis (realização de jobs)
- Date-fns (manipulação de datas)

### Funcionalidades :
##### 1.  Autenticação
- Permite que um usuário se autentique em sua aplicação utilizando e-mail e uma senha.

- Esse primeiro usuário, por ser um administrador único, foi criado utilizando um seed.

- Com o usuário administrador na sua base de dados, utilize esse usuário para todos logins.

- A autenticação feita utilizando JWT com validação dos dados de entrada;

##### 2.  Gestão de alunos
- Alunos são mantidos (cadastrados/atualizados) na aplicação utilizando nome, email, idade, peso e altura.

- O cadastro de alunos só pode ser feito por administradores autenticados na aplicação.

- O aluno não pode se autenticar no sistema, ou seja, não possui senha.

##### 3.  Gestão de planos
- Permite que o usuário possa cadastrar planos para matrícula de alunos.
- Possui três planos padrões criado utilizando seed: **Start**, **Gold** e **Diamante**

##### 4.  Gestão de Matrículas
- Apesar do aluno estar cadastrado na plataforma, isso não significa que o mesmo tem uma matrícula ativa e que pode acessar a academia.

- Permite o cadastro de matrículas por aluno.

- A data de início da matrícula é escolhida pelo usuário.

- A data de término e preço da matrícula é calculada com base no plano selecionado.
- Quando um aluno realiza uma matrícula ele recebe um e-mail com detalhes da sua inscrição na academia como plano, data de término, valor e uma mensagem de boas-vidas.

##### 5.  Gestão de Checkins
- Quando o aluno chega na academia o mesmo realiza um check-in apenas informando seu ID de cadastro (ID do banco de dados);

- O usuário só pode fazer 5 checkins dentro de um período de 7 dias corridos.

##### 6.  Gestão de Pedidos de auxílio
- O aluno pode criar pedidos de auxílio para a academia em relação a algum exercício, alimentação ou instrução qualquer;

- Lista todos pedidos de auxílio sem resposta;
- O aluno cadastra pedidos de auxílio apenas informando seu ID de cadastro (ID do banco de dados);

- Lista todos pedidos de auxílio de um usuário com base em seu ID de cadastro;

- O usuário administrador responde um pedido de auxílio;

- Quando um pedido de auxílio for respondido, o aluno deve receber um e-mail da plataforma com a pergunta e resposta da academia;

### Utilização :
- Instale as dependências:  `yarn or npm install`
- Mude as credenciais do banco de dados postgres, redis e no seu serviço de email na pasta ***src/config***
- Crie as tabelas do banco de dados com o comando ``yarn sequelize db:migrate``.
- Crie o usuário Administrador executando `yarn sequelize db:seed:all`.
- O sistema utiliza filas de execução para ordenar o envio de e-mails, para ativar estas filas utilize `yarn queue`.
- Para colocar o sistema em funcionamento, execute o comando `yarn dev`.




## Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
