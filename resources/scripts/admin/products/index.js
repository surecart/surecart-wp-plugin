const { render } = wp.element;

import '../store/account/register';
import '../store/ui/register';
import '../store/notices/register';
import './store/register';

/**
 * App
 */
import Product from './Product';

/**
 * Render
 */
render( <Product />, document.getElementById( 'app' ) );
