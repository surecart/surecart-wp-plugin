// const { render } = wp.element;
import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * App
 */
import Coupons from './Coupons';

/**
 * Render
 */
render(<Coupons />, document.getElementById('app'));
