/**
 * External dependencies.
 */
import { createStore } from '@stencil/store';

/**
 * Internal dependencies.
 */
import { CountryLocaleField, CountryLocaleFieldValue } from '../../types';
import { getSerializedState } from '@store/utils';

const { i18n } = getSerializedState();

interface Store {
  countryFields: Array<CountryLocaleField>;
  defaultCountryFields: Array<CountryLocaleFieldValue>;
}

const { state, onChange, on, set, get, dispose } = createStore<Store>(
  {
    countryFields: [],
    defaultCountryFields: [],
    ...i18n,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, set, get, dispose };
