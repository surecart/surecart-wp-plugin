import { render } from '@wordpress/element';
import '../store';

import Settings from './AccountSettings';

render(<Settings />, document.getElementById('app'));
