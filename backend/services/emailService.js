import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

export const sendPasswordResetEmail = async ({ email, username, resetUrl }) => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("SMTP email configuration is missing");
  }

  await createTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Reset your MiniJira password",
    text: `Hello ${username},\n\nUse this link to reset your MiniJira password. It expires in 15 minutes:\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `<p>Hello ${username},</p><p>Use the link below to reset your MiniJira password. It expires in 15 minutes.</p><p><a href="${resetUrl}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  });
};

export const sendProjectInvitationEmail = async ({
  email,
  projectName,
  inviterName,
  acceptUrl,
}) => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error("SMTP email configuration is missing");
  }

  await createTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: `${inviterName} invited you to join ${projectName}`,
    text: `Hello,\n\n${inviterName} has invited you to join the project "${projectName}" in MiniJira.\n\nTo accept this invitation, click the link below:\n${acceptUrl}\n\nIf you did not expect this invite, you can ignore this email.`,
    html: `<p>Hello,</p><p><strong>${inviterName}</strong> has invited you to join the project <strong>${projectName}</strong> in MiniJira.</p><p><a href="${acceptUrl}">Accept invitation</a></p><p>If you did not expect this invite, you can ignore this email.</p>`,
  });
};
