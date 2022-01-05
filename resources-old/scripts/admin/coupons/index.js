// const { render } = wp.element;
import { render } from '@wordpress/element';

import './store/register';

/**
 * App
 */
import Coupons from './Coupons';

/**
 * Render
 */
render( <Coupons />, document.getElementById( 'app' ) );
