import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { register, createReduxStore } from '@wordpress/data';

/**
 * App
 */
import Product from './Product';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Register metaboxes store.
 */
import { store, config } from '../store/metaboxes';
export const metaBoxStore = createReduxStore(store, config);
register(metaBoxStore);

/**
 * Render
 */
render(<Product />, document.getElementById('app'));
