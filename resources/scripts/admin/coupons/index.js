const { render } = wp.element;

import '../store/account/register';
import '../store/ui/register';
import '../store/notices/register';
import './store/register';

/**
 * App
 */
import Coupons from './Coupons';

/**
 * Render
 */
render( <Coupons />, document.getElementById( 'app' ) );
