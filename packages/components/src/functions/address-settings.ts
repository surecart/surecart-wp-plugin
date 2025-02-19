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
        field.priority = fieldsByCountry[countryCode][field.name].priority || field.priority;
        field.label = fieldsByCountry[countryCode][field.name].label || field.label;
      }
    });
  }

  return fields.sort((a, b) => a.priority - b.priority);
}
