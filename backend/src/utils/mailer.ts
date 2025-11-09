import nodemailer from "nodemailer";
import { config } from "../config/app.config";

let transporter: nodemailer.Transporter | null = null;

export const getTransporter = () => {
  if (transporter) return transporter;

  if (!config.SMTP_HOST || !config.SMTP_USER || !config.SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  return transporter;
};

export const sendMail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  const tx = getTransporter();
  if (!tx) return { sent: false, reason: "SMTP not configured" } as const;

  await tx.sendMail({
    from: config.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });

  return { sent: true } as const;
};
