const { combineReducers } = wp.data;
import * as reducers from '../../store/data/reducer';

// add any other reducers here.

// export reducers.
export default combineReducers( {
	...reducers,
} );
