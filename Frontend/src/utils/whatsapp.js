export const WHATSAPP_NUMBER = '255694007665';

const formatTsh = (amount) => `Tshs ${Number(amount || 0).toLocaleString()}`;

export const buildOrderMessage = (items) => {
  const lines = items.map((item, i) => {
    const details = [item.variant, item.color].filter(Boolean).join(', ');
    const label = details ? `${item.name} (${details})` : item.name;
    return `${i + 1}. ${label} x${item.quantity} - ${formatTsh(item.price * item.quantity)}`;
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return [
    "Hello HS Store, I'd like to order:",
    '',
    ...lines,
    '',
    `Total: ${formatTsh(total)}`,
  ].join('\n');
};

export const getWhatsAppOrderUrl = (items) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage(items))}`;

export const openWhatsAppOrder = (items) => {
  window.open(getWhatsAppOrderUrl(items), '_blank', 'noopener,noreferrer');
};
