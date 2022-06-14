import { render } from '@wordpress/element';
import '../store';

import Settings from './ConnectionSettings';

render(<Settings />, document.getElementById('app'));
