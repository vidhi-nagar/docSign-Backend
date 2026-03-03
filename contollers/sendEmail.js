import crypto from "crypto";
import nodemailer from "nodemailer";

const sendEmail = async (email, subject, link) => {
  try {
    console.log(
      "Check Credentials:",
      process.env.EMAIL_USER,
      "Pass Length:",
      process.env.EMAIL_PASS?.length,
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Aapka Gmail
        pass: process.env.EMAIL_PASS, // Aapka App Password
      },
      tls: {
        rejectUnauthorized: false, // Yeh line connection issues ko bypass karne mein help karti hai
      },
    });

    console.log("PASSWORD EXACT:", `<${process.env.EMAIL_PASS}>`);
    const mailOptions = {
      from: `"Digital Signature",<${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: `
        <h3>Signature Request</h3>
        <p>Aapko ek document sign karne ke liye bheja gaya hai.</p>
        <a href="${link}" style="padding: 10px 20px; background: blue; color: white; text-decoration: none; border-radius: 5px;">
          Sign Document Now
        </a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent successfully: " + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.log("Email error:", error);
    return { success: false, error: error.message };
  }
};

export default sendEmail;
