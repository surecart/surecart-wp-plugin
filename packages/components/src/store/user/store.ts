/**
 * External dependencies.
 */
import { createStore } from '@stencil/store';

/**
 * Internal dependencies.
 */
import { getSerializedState } from '@store/utils';
const { user } = getSerializedState();

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

export default state;
export { state, onChange, dispose };
