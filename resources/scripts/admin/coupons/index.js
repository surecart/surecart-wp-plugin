const { render } = wp.element;
const { registerStore } = wp.data;

import '../store/ui/register';
import '../store/notices/register';

// coupon
import {
	STORE_KEY as COUPON_STORE_KEY,
	STORE_CONFIG as couponConfig,
} from './store';
registerStore( COUPON_STORE_KEY, couponConfig );

/**
 * App
 */
import App from './app';

/**
 * Render
 */
render( <App />, document.getElementById( 'app' ) );
