import { createRoot } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import '../store/add-entities';

import Dashboard from './Dashboard';

createRoot(document.getElementById('app')).render(<Dashboard />);
