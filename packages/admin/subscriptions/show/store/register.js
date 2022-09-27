import { registerStore } from '@wordpress/data';
import { store, config } from './index';
import './entities';
registerStore(store, config);
