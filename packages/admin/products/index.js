import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import '../../blocks';

/**
 * App
 */
import Product from './Product';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * Render
 */
render(<Product />, document.getElementById('app'));
