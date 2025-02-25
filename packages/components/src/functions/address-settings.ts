/**
 * Internal dependencies.
 */
import { CountryLocaleField, CountryLocaleFieldValue } from 'src/types';

export function sortAddressFields(countryCode: string, defaultCountryFields: Array<CountryLocaleFieldValue>, countryFields: Array<CountryLocaleField>) {
  const fields = defaultCountryFields || [];
  const fieldsByCountry = countryFields || {};

  if (countryCode && fieldsByCountry?.[countryCode]) {
    fields.forEach(field => {
      if (fieldsByCountry?.[countryCode]?.[field?.name]) {
        const countryField = fieldsByCountry[countryCode][field.name];
        field.priority = countryField?.priority || field?.priority;
        field.label = countryField?.label || field?.label;
        field.hidden = countryField?.hidden || field?.hidden;
      }
    });
  }

  return fields.sort((a, b) => a.priority - b.priority);
}
