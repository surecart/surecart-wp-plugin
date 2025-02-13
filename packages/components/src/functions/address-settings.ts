/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

export const addressFields = [
  { name: 'name', priority: 30, label: __('Name or Company Name', 'surecart') },
  { name: 'address_1', priority: 50, label: __('Address', 'surecart') },
  { name: 'address_2', priority: 60, label: __('Address Line 2', 'surecart') },
  { name: 'city', priority: 70, label: __('City', 'surecart') },
  { name: 'state', priority: 80, label: __('State/Province/Region', 'surecart') },
  { name: 'postcode', priority: 90, label: __('Postal Code/Zip', 'surecart') },
];

export const getCountryLocales = () => {
  return {
    AE: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    AF: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    AL: {
      state: { priority: 70, label: __('County', 'surecart') },
    },
    AO: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    AT: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    AU: {
      city: { priority: 60, label: __('Suburb', 'surecart') },
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    AX: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    BA: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Canton', 'surecart') },
    },
    BD: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('District', 'surecart') },
    },
    BE: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    BG: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    BH: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    BI: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    BO: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Department', 'surecart') },
    },
    BS: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
    },
    BZ: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    CA: {
      postcode: { priority: 65, label: __('Postal code', 'surecart') },
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    CH: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Canton', 'surecart') },
    },
    CL: {
      city: { priority: 60, label: __('City', 'surecart') },
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Region', 'surecart') },
    },
    CN: {
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    CO: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Department', 'surecart') },
    },
    CR: {
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    CW: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    CY: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    CZ: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    DE: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    DK: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    DO: {
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    EC: {
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    EE: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    ET: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    FI: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    FR: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    GG: {
      state: { priority: 70, label: __('Parish', 'surecart') },
    },
    GH: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Region', 'surecart') },
    },
    GP: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    GF: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    GR: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    GT: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Department', 'surecart') },
    },
    HK: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      city: { priority: 60, label: __('Town / District', 'surecart') },
      state: { priority: 70, label: __('Region', 'surecart') },
    },
    HN: {
      state: { priority: 70, label: __('Department', 'surecart') },
    },
    HU: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      address_1: { priority: 71, label: __('Address Line 1', 'surecart') },
      address_2: { priority: 72, label: __('Address Line 2', 'surecart') },
      state: { priority: 70, label: __('County', 'surecart') },
    },
    ID: {
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    IE: {
      postcode: { priority: 65, label: __('Eircode', 'surecart') },
      state: { priority: 70, label: __('County', 'surecart') },
    },
    IS: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    IL: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    IM: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    IN: {
      postcode: { priority: 65, label: __('PIN Code', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    IR: {
      state: { priority: 50, label: __('State', 'surecart') },
      city: { priority: 60, label: __('City', 'surecart') },
      address_1: { priority: 70, label: __('Address Line 1', 'surecart') },
      address_2: { priority: 80, label: __('Address Line 2', 'surecart') },
    },
    IT: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    JM: {
      city: { priority: 60, label: __('Town / City / Post Office', 'surecart') },
      postcode: { priority: 65, label: __('Postal Code', 'surecart') },
      state: { priority: 70, label: __('Parish', 'surecart') },
    },
    JP: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 66, label: __('Prefecture', 'surecart') },
      city: { priority: 67, label: __('City', 'surecart') },
      address_1: { priority: 68, label: __('Address Line 1', 'surecart') },
      address_2: { priority: 69, label: __('Address Line 2', 'surecart') },
    },
    KN: {
      postcode: { priority: 65, label: __('Postal code', 'surecart') },
      state: { priority: 70, label: __('Parish', 'surecart') },
    },
    KR: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    KW: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    LV: {
      state: { priority: 70, label: __('Municipality', 'surecart') },
    },
    LB: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    MF: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    MQ: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    MT: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    MZ: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    NI: {
      state: { priority: 70, label: __('Department', 'surecart') },
    },
    NL: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    NG: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    NZ: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Region', 'surecart') },
    },
    NO: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    NP: {
      state: { priority: 70, label: __('State / Zone', 'surecart') },
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
    },
    PA: {
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    PL: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    PR: {
      city: { priority: 60, label: __('Municipality', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    PT: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    PY: {
      state: { priority: 70, label: __('Department', 'surecart') },
    },
    RE: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    RO: {
      state: { priority: 70, label: __('County', 'surecart') },
    },
    RS: {
      city: { priority: 60, label: __('City', 'surecart') },
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('District', 'surecart') },
    },
    RW: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    SG: {
      state: { priority: 70, label: __('State', 'surecart') },
      city: { priority: 60, label: __('City', 'surecart') },
    },
    SK: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    SI: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    SR: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
    },
    SV: {
      state: { priority: 70, label: __('Department', 'surecart') },
    },
    ES: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    LI: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    LK: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    LU: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    MD: {
      state: { priority: 70, label: __('Municipality / District', 'surecart') },
    },
    SE: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    TR: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    UG: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      city: { priority: 60, label: __('Town / Village', 'surecart') },
      state: { priority: 70, label: __('District', 'surecart') },
    },
    US: {
      postcode: { priority: 65, label: __('ZIP Code', 'surecart') },
      state: { priority: 70, label: __('State', 'surecart') },
    },
    UY: {
      state: { priority: 70, label: __('Department', 'surecart') },
    },
    GB: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('County', 'surecart') },
    },
    ST: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      state: { priority: 70, label: __('District', 'surecart') },
    },
    VN: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
      address_2: { priority: 70, label: __('Address Line 2', 'surecart') },
    },
    WS: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
    },
    YT: {
      state: { priority: 70, label: __('State', 'surecart') },
    },
    ZA: {
      state: { priority: 70, label: __('Province', 'surecart') },
    },
    ZW: {
      postcode: { priority: 65, label: __('Postcode', 'surecart') },
    },
  };
};

export function sortAddressFields(fields: any, countryCode: string) {
  const countryLocale = getCountryLocales();
  if (countryCode && countryLocale[countryCode]) {
    fields.forEach(field => {
      if (countryLocale[countryCode][field.name]) {
        field.priority = countryLocale[countryCode][field.name].priority || field.priority;
        field.label = countryLocale[countryCode][field.name].label || field.label;
      }
    });
  }

  return fields.sort((a, b) => a.priority - b.priority);
}
