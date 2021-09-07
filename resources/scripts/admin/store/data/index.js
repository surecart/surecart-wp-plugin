/**
 * Internal dependencies
 */
import reducer from './reducer';
import controls from './controls';
import * as selectors from './selectors';
import * as actions from './actions';
import resolvers from './resolvers';

export { default as STORE_KEY } from './constants.js';

export const STORE_CONFIG = {
	reducer,
	selectors,
	controls,
	resolvers,
	actions,
};
