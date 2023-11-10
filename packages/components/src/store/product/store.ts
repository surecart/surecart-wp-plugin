import { createStore } from '@stencil/store';
import { ProductState } from 'src/types';
import { productViewed } from './events';
import { getDefaultState } from './getters';

interface Store {
  [key: string]: ProductState;
}

const defaultState: Store = getDefaultState();

Object.values(defaultState)
  .filter((stateProduct: ProductState) => stateProduct?.isProductPage)
  .forEach((stateProduct: ProductState) => {
    if (stateProduct?.product?.id) {
      productViewed(stateProduct?.product);
    }
  });

const store = createStore<Store>(defaultState, (newValue, oldValue) => {
  return JSON.stringify(newValue) !== JSON.stringify(oldValue);
});

const { state, onChange, on, dispose, forceUpdate } = store;
export default state;
export { state, onChange, on, dispose, forceUpdate };

if (window?.sc?.store) {
  window.sc.store.product = store; // need to deprecate this
  window.sc.store.products = store;
}
