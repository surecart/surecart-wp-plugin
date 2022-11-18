// const { render } = wp.element;
import { render } from '@wordpress/element';

/**
 * register store entities.
 */
import '@admin/schema/register';

/**
 * register store and entities.
 */
import '../store/add-entities';

/**
 * App
 */
import Coupon from './Coupon';

/**
 * Render
 */
render(<Coupon />, document.getElementById('app'));
