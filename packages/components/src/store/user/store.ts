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
export const CODE_EXPIRED = 'code_expired';

interface Store {
  loggedIn: boolean;
  email: string;
  name: string;
  avatarUrl: string;
  verificationStatus: 'code_sent' | 'verifying' | 'verified' | 'unverified' | 'code_expired' | null;
  /** Absolute client-side timestamp (ms) when the next code resend is allowed. Anchors the cooldown across reload, tab switch, and "Change". */
  resendAvailableAt: number | null;
}

const { state, onChange, dispose } = createStore<Store>({
  loggedIn: false,
  email: '',
  name: '',
  avatarUrl: '',
  verificationStatus: null,
  resendAvailableAt: null,
  ...user,
});

export const resetUser = () => {
  state.loggedIn = false;
  state.email = '';
  state.name = '';
  state.avatarUrl = '';
  state.verificationStatus = null;
  state.resendAvailableAt = null;
};

export default state;
export { state, onChange, dispose };
