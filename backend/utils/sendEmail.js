const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADMIN,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `EsportivaVip <${process.env.EMAIL_ADMIN}>`,
      to: email,
      subject: subject,
      html: text
    });
  } catch (error) {
    console.error('Erro ao enviar email', email, error);
  }
};

module.exports = sendEmail;
