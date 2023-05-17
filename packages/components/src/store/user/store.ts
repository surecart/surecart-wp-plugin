import { createStore } from '@stencil/store';

interface Store {
  loggedIn: boolean;
  email: string;
  name: string;
}

const { state, onChange, dispose } = createStore<Store>({
  loggedIn: false,
  email: '',
  name: '',
});

export default state;
export { state, onChange, dispose };
