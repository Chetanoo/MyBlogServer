"use strict";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "nbhii5ctvfq6fzee@ethereal.email",
    pass: "6bk1pansDcBvhJrV1M",
  },
});
export async function sendEmail(to: string, html: string) {
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: to, // list of receivers
    subject: "Password change.", // Subject line
    html, // html body
  });
  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
