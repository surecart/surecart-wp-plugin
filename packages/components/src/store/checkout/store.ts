import { createStore } from '@stencil/store';

import { Checkout, GeoCoordinates, LineItemData, Product, TaxProtocol } from '../../types';
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
  captureGeoAddressEnabled: boolean;
  geoCoordinates: GeoCoordinates | null;
  showLoginPrompt: boolean;
  initialLineItems: LineItemData[];
  taxProtocol: TaxProtocol;
  isCheckoutPage: boolean;
  validateStock: boolean;
  persist: 'browser' | 'url' | false;
  paymentMethodRequiresShipping: boolean;
}

const { state, onChange, on, set, get, dispose, reset } = createStore<Store>(
  {
    formId: null,
    groupId: null,
    mode: 'live',
    locks: [],
    product: null,
    checkout: null,
    currencyCode: 'usd',
    abandonedCheckoutEnabled: true,
    captureGeoAddressEnabled: false,
    geoCoordinates: null,
    showLoginPrompt: true,
    initialLineItems: [],
    isCheckoutPage: false,
    validateStock: false,
    persist: 'browser',
    paymentMethodRequiresShipping: false,
    ...checkout,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

export default state;
export { state, onChange, on, set, get, dispose, reset };
