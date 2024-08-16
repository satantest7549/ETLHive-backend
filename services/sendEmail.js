const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Authentication & Lead Application👻" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    return "Email sent successfully";
  } catch (error) {
    return error;
  }
};

module.exports = sendEmail;
