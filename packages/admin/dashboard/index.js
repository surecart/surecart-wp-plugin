import { render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * App
 */
import Dashboard from './Dashboard';

import './style.scss';

/**
 * Render
 */
render(<Dashboard />, document.getElementById('app'));
