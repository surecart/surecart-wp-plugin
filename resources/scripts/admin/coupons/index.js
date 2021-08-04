const { render } = wp.element;
const { registerStore } = wp.data;

import store from './store';
registerStore( 'checkout-engine/coupon', store );

import '../store/ui/register';
import '../store/notices/register';

/**
 * App
 */
import App from './app';

/**
 * Render
 */
render( <App />, document.getElementById( 'app' ) );
