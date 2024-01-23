import { createStore } from '@stencil/store';

import { Checkout, LineItemData, Prices, Product, Products, TaxProtocol } from '../../types';
import { getSerializedState } from '@store/utils';
const { checkout } = getSerializedState();

interface Store {
  formId: number | string;
  groupId: string;
  mode: 'live' | 'test';
  locks: string[];
  product: Product;
  checkout: Checkout;
  currencyCode: string;
  abandonedCheckoutEnabled: boolean;
  initialLineItems: LineItemData[];
  taxProtocol: TaxProtocol;
  isCheckoutPage: boolean;
  validateStock: boolean;
  persist: 'browser' | 'url' | false;
  busy: boolean;
  pricesEntities?: Prices,
  productsEntities?: Products,
}

const { state, onChange, on, set, get, dispose } = createStore<Store>(
  {
    formId: null,
    groupId: null,
    mode: 'live',
    locks: [],
    product: null,
    checkout: null,
    currencyCode: 'usd',
    abandonedCheckoutEnabled: true,
    initialLineItems: [],
    isCheckoutPage: false,
    validateStock: false,
    persist: 'browser',
    busy: false,
    ...checkout,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, set, get, dispose };
