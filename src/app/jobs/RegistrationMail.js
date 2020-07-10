const { format, parseISO } = require('date-fns');
const pt = require('date-fns/locale/pt');
const Mail = require('../../lib/Mail');

class RegistrationMail {
  // retorna variável sem constructor que retorna uma chave única p/ cada JOB
  get key() {
    return 'RegistrationMail';
  }

  /**
   * o que vai ser executado quando o processo for chamado
   */
  async handle({ data }) {
    const { registration, student, plan } = data; // recendo os dados do RegistrationController

    // console.log('fila executou');
    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula efetuada',
      template: 'registration',
      /**
       * enviando variáveis que estão esperando ser recebidas nas views
       */
      context: {
        student_name: student.name,
        plan_title: plan.title,
        start_date: format(
          parseISO(registration.start_date),
          "'dia' dd 'de' MMMM ', às ' H:mm'h'",
          { locale: pt }
        ),
        end_date: format(
          parseISO(registration.end_date),
          "'dia' dd 'de' MMMM ', às ' H:mm'h'",
          { locale: pt }
        ),
        total_price: registration.total_price,
      },
    });
  }
}

module.exports = new RegistrationMail();
