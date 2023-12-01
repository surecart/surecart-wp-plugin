import { state } from './store';
export const resetUser = () => {
  state.loggedIn = false;
  state.email = '';
  state.name = '';
  state.matched = false;
};
