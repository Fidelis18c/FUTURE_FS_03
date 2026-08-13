const slugify = (str) =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Postgres foreign_key_violation — e.g. deleting a product/variant that a
// real order references. Surfaced as a clear 409 instead of a raw 500.
const isFkViolation = (err) => err.code === '23503';

module.exports = { slugify, isFkViolation };
