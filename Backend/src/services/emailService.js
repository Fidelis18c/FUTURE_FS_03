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
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');
    const receivedAt = new Date().toLocaleString('en-GB', {
      dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Dar_es_Salaam',
    });

    await axios.post(
      'https://api.resend.com/emails',
      {
        from: `HS Store <${CONTACT_FROM_EMAIL}>`,
        to: [ADMIN_EMAIL],
        reply_to: email,
        subject: `New contact message from ${name}`,
        html: `
          <div style="background-color:#f5f5f7;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
            <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e5;">

              <div style="background:#111111;padding:24px 32px;">
                <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:1px;">HS Store</p>
                <p style="margin:4px 0 0;color:#bbbbbb;font-size:12px;">New message from your website contact form</p>
              </div>

              <div style="padding:28px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-size:14px;color:#333333;">
                  <tr>
                    <td style="padding:6px 0;width:90px;color:#888888;">From</td>
                    <td style="padding:6px 0;font-weight:bold;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#888888;">Email</td>
                    <td style="padding:6px 0;"><a href="mailto:${safeEmail}" style="color:#ea580c;text-decoration:none;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#888888;">Received</td>
                    <td style="padding:6px 0;">${receivedAt}</td>
                  </tr>
                </table>

                <div style="margin-top:20px;padding:18px 20px;background:#f5f5f7;border-radius:12px;">
                  <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#888888;text-transform:uppercase;">Message</p>
                  <p style="margin:0;font-size:14px;line-height:1.7;color:#222222;">${safeMessage}</p>
                </div>

                <p style="margin:24px 0 0;font-size:13px;color:#666666;">
                  Reply to this email to answer ${safeName} directly.
                </p>
              </div>

              <div style="padding:16px 32px;border-top:1px solid #eeeeee;">
                <p style="margin:0;font-size:11px;color:#999999;">HS Store &middot; Skycity Mall, Dar es Salaam &middot; +255 762 889 818</p>
              </div>

            </div>
          </div>
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
