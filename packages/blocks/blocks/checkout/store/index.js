import { registerStore, combineReducers } from '@wordpress/data';

import { entities } from '../../../../../resources/scripts/admin/store/data/reducer';
import * as selectors from '../../../../../resources/scripts/admin/store/data/selectors';
import * as actions from '../../../../../resources/scripts/admin/store/data/actions';
import resolvers from './resolvers';

// export store key.
import STORE_KEY from '../../../../../resources/scripts/admin/store/data/constants';

// export config.
export const STORE_CONFIG = {
	reducer: combineReducers( { entities } ),
	selectors,
	resolvers,
	actions,
};

export default registerStore( STORE_KEY, STORE_CONFIG );
