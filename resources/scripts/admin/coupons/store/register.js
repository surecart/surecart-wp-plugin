import { createReduxStore, register } from '@wordpress/data';
import { STORE_KEY, STORE_CONFIG } from './index';
const store = createReduxStore(STORE_CONFIG);
register( STORE_KEY, store );
