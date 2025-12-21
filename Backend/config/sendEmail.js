import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text, html = null) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MyApp Support" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    });

    console.log(` Email sent successfully to ${to.replace(/(.{2}).+(@.+)/, "$1****$2")}`);
  } catch (error) {
    console.error(" Email send failed:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

export default sendEmail;
