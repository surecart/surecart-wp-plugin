import { render } from '@wordpress/element';
import './store/register';

import Settings from './PortalSettings';

render(<Settings />, document.getElementById('app'));
