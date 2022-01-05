/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';

export { default as STORE_KEY } from './constants.js';

export const STORE_CONFIG = {
	reducer,
	selectors,
	actions,
};
