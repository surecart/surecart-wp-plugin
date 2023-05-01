import { createStore } from '@stencil/store';

interface Store {
  loggedIn: boolean;
}

const { state, onChange, dispose } = createStore<Store>({
  loggedIn: false,
});

export default state;
export { state, onChange, dispose };
