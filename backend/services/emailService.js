import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async ({ email, username, resetUrl }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend API key is missing");
  }

  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM || "MiniJira <onboarding@resend.dev>",
    to: [email],
    subject: "Reset your MiniJira password",
    text: `Hello ${username},

Use this link to reset your MiniJira password. It expires in 15 minutes:

${resetUrl}

If you did not request this, you can ignore this email.`,
    html: `
      <p>Hello ${username},</p>

      <p>
        Use the link below to reset your MiniJira password.
        It expires in 15 minutes.
      </p>

      <p>
        <a href="${resetUrl}">
          Reset your password
        </a>
      </p>

      <p>
        If you did not request this, you can ignore this email.
      </p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const sendProjectInvitationEmail = async ({
  email,
  projectName,
  inviterName,
  acceptUrl,
}) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend API key is missing");
  }

  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM || "MiniJira <onboarding@resend.dev>",
    to: [email],
    subject: `${inviterName} invited you to join ${projectName}`,
    text: `Hello,

${inviterName} has invited you to join the project "${projectName}" in MiniJira.

To accept this invitation, click the link below:

${acceptUrl}

If you did not expect this invite, you can ignore this email.`,
    html: `
      <p>Hello,</p>

      <p>
        <strong>${inviterName}</strong> has invited you to join
        the project <strong>${projectName}</strong> in MiniJira.
      </p>

      <p>
        <a href="${acceptUrl}">
          Accept invitation
        </a>
      </p>

      <p>
        If you did not expect this invite, you can ignore this email.
      </p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
};
