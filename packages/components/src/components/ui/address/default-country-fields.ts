import { __ } from '@wordpress/i18n';
import { CountryLocaleFieldValue } from '../../../types';

export const defaultCountryFields: Array<CountryLocaleFieldValue> = [
  {
    name: 'country',
    priority: 30,
    label: __('Country', 'surecart'),
  },
  {
    name: 'name',
    priority: 40,
    label: __('Name or Company Name', 'surecart'),
  },
  {
    name: 'line_1',
    priority: 50,
    label: __('Address', 'surecart'),
  },
  {
    name: 'line_2',
    priority: 60,
    label: __('Line 2', 'surecart'),
  },
  {
    name: 'city',
    priority: 70,
    label: __('City', 'surecart'),
  },
  {
    name: 'state',
    priority: 80,
    label: __('State / County', 'surecart'),
  },
  {
    name: 'postal_code',
    priority: 90,
    label: __('Postal Code', 'surecart'),
  },
];
