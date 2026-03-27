/**
 * External dependencies.
 */
import { createStore } from '@stencil/store';

/**
 * Internal dependencies.
 */
import { getSerializedState } from '@store/utils';
const { user } = getSerializedState();

export const VERIFIED = 'verified';
export const VERIFYING = 'verifying';
export const CODE_SENT = 'code_sent';
export const UNVERIFIED = 'unverified';

interface Store {
  loggedIn: boolean;
  email: string;
  name: string;
  verificationStatus: 'code_sent' | 'verifying' | 'verified' | 'unverified' | null;
}

const { state, onChange, dispose } = createStore<Store>({
  loggedIn: false,
  email: '',
  name: '',
  verificationStatus: null,
  ...user,
});

export const resetUser = () => {
  state.loggedIn = false;
  state.email = '';
  state.name = '';
  state.verificationStatus = null;
};

export default state;
export { state, onChange, dispose };
