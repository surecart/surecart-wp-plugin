import { render } from '@wordpress/element';

import './store/register';

/**
 * App
 */
import Customers from './Customers';

/**
 * Render
 */
render(<Customers />, document.getElementById('app'));
