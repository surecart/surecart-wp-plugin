/**
 * Internal dependencies
 */
import controls from '../../store/model/controls';

import reducer from './reducer';
import * as selectors from './selectors';
import * as actions from './actions';
import resolvers from './resolvers';

export default {
	reducer,
	selectors,
	controls,
	resolvers,
	actions,
};
