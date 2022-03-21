import { render } from '@wordpress/element';
import { registerStore } from '@wordpress/data';

import store from './store';
registerStore('surecart/settings', store);

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * App
 */
import Settings from './Settings';

/**
 * Render
 */
render(<Settings />, document.getElementById('app'));
