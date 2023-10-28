import { createStore } from '@stencil/store';
import { getSerializedState } from '@store/utils';
const { productDonation } = getSerializedState();

interface Store {
  [key: string]: any;
}

const { state, onChange, on, set, get, dispose } = createStore<Store>({ ...productDonation }, (newValue, oldValue) => {
  return JSON.stringify(newValue) !== JSON.stringify(oldValue);
});

export default state;
export { state, onChange, on, set, get, dispose };
