/**
 * Internal dependencies
 */
import controls from '../../store/fetch/controls';
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import resolvers from './resolvers';

export { default as STORE_KEY } from './constants.js';

export const STORE_CONFIG = {
	reducer,
	controls,
	resolvers,
	selectors,
	actions,
};
