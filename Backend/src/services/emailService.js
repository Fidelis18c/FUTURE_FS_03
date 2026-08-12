const axios = require('axios');
require('dotenv').config();

const escapeHtml = (str = '') =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Emails the store owner whenever a contact form message comes in.
 * Best-effort: failures are logged, not thrown, since the message
 * is already saved in the database regardless of email delivery.
 */
const sendContactNotification = async ({ name, email, message }) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

  if (!RESEND_API_KEY || !ADMIN_EMAIL) {
    const msg = 'RESEND_API_KEY or ADMIN_EMAIL not set';
    console.warn(`⚠️ ${msg} — skipping contact email notification`);
    return { success: false, error: msg };
  }

  try {
    await axios.post(
      'https://api.resend.com/emails',
      {
        from: `HS Store Contact Form <${CONTACT_FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `New contact message from ${name}`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true };
  } catch (error) {
    const errorData = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error('❌ Resend email error:', errorData);
    return { success: false, error: errorData };
  }
};

module.exports = { sendContactNotification };
