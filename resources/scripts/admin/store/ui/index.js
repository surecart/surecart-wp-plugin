/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';

export { default as store } from './constants.js';

export const config = {
	reducer,
	selectors,
	actions,
};
