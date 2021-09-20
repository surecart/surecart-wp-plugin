import controls from '../../store/data/controls';
import reducer from './reducer';
import * as selectors from './selectors';
import * as modelSelectors from '../../store/data/selectors';
import * as actions from './actions';
import * as modelActions from '../../store/data/actions';
import resolvers from './resolvers';

// export store key.
export { default as STORE_KEY } from '../../store/data/constants.js';

// export config.
export const STORE_CONFIG = {
	reducer,
	selectors: { ...modelSelectors, ...selectors },
	controls,
	resolvers,
	actions: { ...modelActions, ...actions },
};
