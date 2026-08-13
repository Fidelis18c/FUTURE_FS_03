// Newest iPhone generation first (17, 16, 15...), matching how shoppers expect
// a phone lineup to be presented — rather than whatever order products happen
// to have been created/seeded in.
const getIphoneGeneration = (name = '') => {
  const match = name.match(/iphone\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : -1;
};

export const sortIphonesFirst = (products) =>
  [...products].sort((a, b) => getIphoneGeneration(b.name) - getIphoneGeneration(a.name));
