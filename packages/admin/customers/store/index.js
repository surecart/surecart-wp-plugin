import controls from '../../store/data/controls';
import * as actions from './actions';
import reducer from './reducer';
import resolvers from './resolvers';
import * as selectors from './selectors';

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
