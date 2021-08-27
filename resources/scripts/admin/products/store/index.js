/**
 * Internal dependencies
 */
import controls from '../../store/model/controls';

import reducer from './reducer';
import localControls from './controls';
import * as selectors from './selectors';
import * as actions from './actions';
import resolvers from './resolvers';

// export store key.
export { default as STORE_KEY } from './constants.js';

// export config.
export const STORE_CONFIG = {
	reducer,
	selectors,
	controls: { ...controls, ...localControls },
	resolvers,
	actions,
};
