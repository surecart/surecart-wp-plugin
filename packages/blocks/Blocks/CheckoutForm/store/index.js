import { registerStore } from '@wordpress/data';

import reducer from './reducer';
import controls from './controls';
import * as selectors from './selectors';
import * as actions from './actions';
import resolvers from './resolvers';

// export config.
export const STORE_CONFIG = {
	reducer,
	controls,
	selectors,
	resolvers,
	actions,
};

// export key
export const BLOCKS_STORE_KEY = 'surecart/blocks';

export default registerStore(BLOCKS_STORE_KEY, STORE_CONFIG);
