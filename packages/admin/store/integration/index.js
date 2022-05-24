/**
 * Internal dependencies
 */
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import * as resolvers from './resolvers';

export { default as store } from './constants.js';

export const config = {
	reducer,
	selectors,
	resolvers,
	actions,
};
