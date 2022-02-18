import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import '@admin/schema/register';

import './store/register';

/**
 * App
 */
import Customers from './Customers';

/**
 * Render
 */
render(<Customers />, document.getElementById('app'));
