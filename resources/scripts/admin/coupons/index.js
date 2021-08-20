const { render } = wp.element;

import '../store/account/register';
import '../store/ui/register';
import '../store/notices/register';
import './store/register';

/**
 * App
 */
import App from './app';

/**
 * Render
 */
render( <App />, document.getElementById( 'app' ) );
