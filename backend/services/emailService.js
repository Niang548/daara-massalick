const axios = require('axios');
require('dotenv').config();

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

  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { name: 'Daara Massalick', email: process.env.EMAIL_USER },
      to: [{ email }],
      subject: 'Créez votre mot de passe — Daara Massalick',
      htmlContent: html,
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 20000,
    }
  );
};
exports.envoyerMessageContact = async (nomMembre, emailMembre, sujet, message) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
      <div style="background: #1a472a; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #f0c040; margin: 0; font-size: 20px;">Daara Massalick</h1>
        <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin-top: 4px;">Nouveau message d'un membre</p>
      </div>
      <div style="background: #ffffff; padding: 32px; border: 1px solid #eee; border-radius: 0 0 12px 12px;">
        <p style="font-size: 14px; color: #333;"><strong>De :</strong> ${nomMembre} (${emailMembre})</p>
        <p style="font-size: 14px; color: #333;"><strong>Sujet :</strong> ${sujet}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
        <p style="font-size: 14px; color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    </div>
  `;

  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { name: 'Daara Massalick - Site web', email: process.env.EMAIL_USER },
      to: [{ email: process.env.EMAIL_USER }],
      replyTo: { email: emailMembre, name: nomMembre },
      subject: `[Message membre] ${sujet}`,
      htmlContent: html,
    },
    {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 20000,
    }
  );
};