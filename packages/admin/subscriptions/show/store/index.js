import controls from '@surecart/data/controls';
import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import resolvers from './resolvers';

// export store key.
export { default as store } from './constants.js';

// export config.
export const config = {
	reducer,
	selectors,
	controls,
	resolvers,
	actions,
};
