const { render } = wp.element;
const { registerStore } = wp.data;

import store from './store';
registerStore( 'checkout-engine/settings', store );

/**
 * App
 */
import App from './App';

/**
 * Render
 */
render( <App />, document.getElementById( 'app' ) );
