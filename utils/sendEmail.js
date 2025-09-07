const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  if(options.type === 'REFER'){ //feature to be added later.
    await transporter.sendMail({
      from: `Notes App - ${process.env.SENDER_EMAIL}`,
      to: options.to,
      subject: options.subject,
      text: options.text
    })
  } else {

  await transporter.sendMail({
    from: `Notes App - ${process.env.SENDER_EMAIL}`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
};

module.exports = sendEmail;
