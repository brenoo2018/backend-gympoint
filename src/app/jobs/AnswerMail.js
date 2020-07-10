const { format, parseISO } = require('date-fns');
const pt = require('date-fns/locale/pt');
const Mail = require('../../lib/Mail');

class AnswerMail {
  // retorna variável sem constructor que retorna uma chave única p/ cada JOB
  get key() {
    return 'AnswerMail';
  }

  /**
   * o que vai ser executado quando o processo for chamado
   */
  async handle({ data }) {
    const { helpOrder } = data; // recendo os dados do AnswerController

    // console.log('fila executou');
    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Dúvida Respondida',
      template: 'answer',
      /**
       * enviando variáveis que estão esperando ser recebidas nas views
       */
      context: {
        student_name: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answer_at: format(
          parseISO(helpOrder.answer_at),
          "'dia' dd 'de' MMMM ', às ' H:mm'h'",
          { locale: pt }
        ),
      },
    });
  }
}

module.exports = new AnswerMail();
