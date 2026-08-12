const db = require('../../config/db');
const { sendContactNotification } = require('../../services/emailService');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createContactMessage = async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    const result = await db.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING id, name, email, message, created_at',
      [name.trim(), email.trim(), message.trim()]
    );

    // TEMPORARY: awaiting + surfacing the email result for debugging delivery.
    // Revert to fire-and-forget (no _emailDebug) once delivery is confirmed working.
    const emailResult = await sendContactNotification(result.rows[0]);
    res.status(201).json({ ...result.rows[0], _emailDebug: emailResult });
  } catch (err) {
    next(err);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = { createContactMessage, getContactMessages };
