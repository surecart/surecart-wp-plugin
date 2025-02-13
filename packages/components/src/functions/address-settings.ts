export const addressFields = [
  { name: 'name', priority: 30 },
  { name: 'address_1', priority: 50 },
  { name: 'address_2', priority: 60 },
  { name: 'city', priority: 70 },
  { name: 'state', priority: 80 },
  { name: 'postcode', priority: 90 },
];

export const countryLocale = {
  AT: {
    postcode: { priority: 65 },
  },
  AX: {
    postcode: { priority: 65 },
  },
  BA: {
    postcode: { priority: 65 },
  },
  BE: {
    postcode: { priority: 65 },
  },
  BW: {
    postcode: { priority: 70 },
  },
  CH: {
    postcode: { priority: 65 },
  },
  CL: {
    postcode: { priority: 70 },
  },
  EE: {
    postcode: { priority: 65 },
  },
  FI: {
    postcode: { priority: 65 },
  },
  FR: {
    postcode: { priority: 65 },
  },
  HU: {
    postcode: { priority: 65 },
    address_1: { priority: 71 },
    address_2: { priority: 72 },
  },
  IS: {
    postcode: { priority: 65 },
  },
  IL: {
    postcode: { priority: 65 },
  },
  IT: {
    postcode: { priority: 65 },
  },
  JP: {
    postcode: { priority: 65 },
    state: { priority: 66 },
    city: { priority: 67 },
    address_1: { priority: 68 },
    address_2: { priority: 69 },
  },
  NL: {
    postcode: { priority: 65 },
  },
  NO: {
    postcode: { priority: 65 },
  },
  PL: {
    postcode: { priority: 65 },
  },
  SE: {
    postcode: { priority: 65 },
  },
  SI: {
    postcode: { priority: 65 },
  },
  SK: {
    postcode: { priority: 65 },
  },
  TR: {
    postcode: { priority: 65 },
  },
  VN: {
    postcode: { priority: 65 },
  },
};

export function sortAddressFields(fields: any, countryCode: string) {
  if (countryCode && countryLocale[countryCode]) {
    fields.forEach(field => {
      if (countryLocale[countryCode][field.name]) {
        field.priority = countryLocale[countryCode][field.name].priority;
      }
    });
  }

  return fields.sort((a, b) => a.priority - b.priority);
}
