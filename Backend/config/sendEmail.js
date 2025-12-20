import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Virtual AI" <no-reply@virtualai.com>',
      to,
      subject,
      text,
    });

    console.log(` Email sent to ${to}`);
  } catch (error) {
    console.error(" Email send failed:", error.message);
  }
};

export default sendEmail;
