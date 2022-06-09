import { render } from '@wordpress/element';
import './store/register';

import StoreSettings from './StoreSettings';

render(<StoreSettings />, document.getElementById('app'));
