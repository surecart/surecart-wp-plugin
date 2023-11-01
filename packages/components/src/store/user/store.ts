import { createStore } from '@stencil/store';

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
});

export default state;
export { state, onChange, dispose };
