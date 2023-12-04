import { createStore } from '@stencil/store';
import { getSerializedState } from '@store/utils';
const { user } = getSerializedState();

interface Store {
  loggedIn: boolean;
  email: string;
  name: string;
}

const { state, onChange, dispose } = createStore<Store>({
  loggedIn: false,
  email: '',
  name: '',
  ...user,
});

export default state;
export { state, onChange, dispose };
