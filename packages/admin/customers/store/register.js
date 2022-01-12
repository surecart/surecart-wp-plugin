import './entities';
import { store, config } from './index';
import { registerStore } from '@wordpress/data';

registerStore( store, config );
