import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * App
 */
import Edit from './Edit';

/**
 * Render
 */
render(<Edit />, document.getElementById('app'));
