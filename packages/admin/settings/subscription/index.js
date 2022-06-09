import { render } from '@wordpress/element';
import './store/register';

import Settings from './SubscriptionSettings';

render(<Settings />, document.getElementById('app'));
