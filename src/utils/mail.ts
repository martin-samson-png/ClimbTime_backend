import { Resend } from "resend";
import { env } from "../config/env.js";
import { makeErr } from "./error.js";

export interface SendEmail {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

const resend = new Resend(env.RESEND_API_KEY);

export const sendEMail = async (email: SendEmail, id: string) => {
  try {
    const payload = {
      from: process.env.RESEND_FROM as string,
      to: email.to,
      subject: email.subject,
      html: email.html,
      headers: { "Idempotency-Key": id },
      ...(email.text ? { text: email.text } : {}),
      ...(email.replyTo ? { replyTo: email.replyTo } : {}),
      ...(email.tags?.length ? { tags: email.tags } : {}),
    };
    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("error: ", error);
      throw makeErr(502, "Envoi de l'email impossible");
    }

    return data.id;
  } catch (err) {
    console.error("error : ", err);
    throw makeErr(500, "Erreur interne lors de l'envoi du mail");
  }
};

export const invitationAdminEmail = (
  inviteUrl: string,
  expiresAt: Date,
  rawToken: string
) => {
  const expiresAtHuman = expiresAt.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const tags = [{ name: "type", value: "admin_invite" }];

  const subject = "Invitation administrateur";

  const text = `Bonjour,

Vous avez été invité à rejoindre l'espace administrateur.

Ouvrez ce lien pour créer votre compte :
${inviteUrl}

Ce lien expirera le ${expiresAtHuman}.

Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email.
`;

  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.5; color: #111;">
  <h2 style="margin: 0 0 12px;">Invitation administrateur</h2>

  <p style="margin: 0 0 12px;">
    Bonjour,
  </p>

  <p style="margin: 0 0 16px;">
    Vous avez été invité à rejoindre l'espace <strong>administrateur</strong>.
  </p>

  <p style="margin: 0 0 16px;">
    Cliquez sur le bouton ci-dessous pour créer votre compte :
  </p>

  <p style="margin: 0 0 20px;">
    <a href="${inviteUrl}"
       style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 10px 14px; border-radius: 8px;">
      Créer mon compte admin
    </a>
  </p>

  <p style="margin: 0 0 16px; color: #444;">
    Ce lien expirera le <strong>${expiresAtHuman}</strong>.
  </p>

  <hr style="border: 0; border-top: 1px solid #eee; margin: 18px 0;" />

  <p style="margin: 0 0 8px; color: #444;">
    Si le bouton ne fonctionne pas, copiez/collez ce lien dans votre navigateur :
  </p>
  <p style="margin: 0 0 16px;">
    <a href="${inviteUrl}" style="color: #111;">${inviteUrl}</a>
  </p>

  <p style="margin: 18px 0 0; color: #666; font-size: 12px;">
    Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email.
  </p>
</div>
`;

  return { html, text, tags, subject };
};
