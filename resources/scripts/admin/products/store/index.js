/**
 * Internal dependencies
 */
const { combineReducers } = wp.data;

import controls from '../../store/controls/api-fetch';
import model from '../../store/reducers/model';
import ui from '../../store/reducers/model';

import * as selectors from './selectors';
import * as actions from './actions';
import resolvers from './resolvers';

export default {
	reducer: combineReducers( {
		model,
		ui,
	} ),
	selectors,
	controls,
	resolvers,
	actions: {
		...actions,
	},
};
