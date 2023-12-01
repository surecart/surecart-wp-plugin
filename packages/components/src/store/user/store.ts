import { createStore } from '@stencil/store';
import { getSerializedState } from '@store/utils';
const { user } = getSerializedState();

interface Store {
  loggedIn: boolean;
  email: string;
  name: string;
  matched: boolean;
}

const { state, onChange, dispose } = createStore<Store>({
  loggedIn: false,
  email: '',
  name: '',
  matched: false,
  ...user,
});

export default state;
export { state, onChange, dispose };
