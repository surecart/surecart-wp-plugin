import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * App
 */
import Show from './Show';

/**
 * Render
 */
render(<Show />, document.getElementById('app'));
