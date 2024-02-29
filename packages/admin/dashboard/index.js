import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import '../store/add-entities';

/**
 * App
 */
import Dashboard from './Dashboard';

/**
 * Render
 */
render(<Dashboard />, document.getElementById('app'));
