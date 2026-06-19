const SibApiV3Sdk = require('@getbrevo/brevo');
require('dotenv').config();

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

exports.envoyerEmailCreationCompte = async (email, prenom, token) => {
  const lien = `${process.env.FRONTEND_URL}/creer-mot-de-passe/${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a472a; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #f0c040; margin: 0; font-size: 20px;">Daara Massalick</h1>
      </div>
      <div style="background: #ffffff; padding: 32px; border: 1px solid #eee; border-radius: 0 0 12px 12px;">
        <p style="font-size: 15px; color: #333;">Bonjour <strong>${prenom}</strong>,</p>
        <p style="font-size: 14px; color: #555; line-height: 1.6;">
          Bienvenue au Daara Massalick. Votre compte a été créé par l'administration.
          Cliquez sur le bouton ci-dessous pour choisir votre mot de passe et accéder à votre espace personnel.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${lien}" style="background: #1a472a; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">
            Créer mon mot de passe
          </a>
        </div>
        <p style="font-size: 12px; color: #999;">
          Ce lien est valable 48 heures. Si vous n'avez pas demandé cette création de compte, ignorez cet email.
        </p>
      </div>
    </div>
  `;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = 'Créez votre mot de passe — Daara Massalick';
  sendSmtpEmail.htmlContent = html;
  sendSmtpEmail.sender = { name: 'Daara Massalick', email: process.env.EMAIL_USER };
  sendSmtpEmail.to = [{ email }];

  await apiInstance.sendTransacEmail(sendSmtpEmail);
};