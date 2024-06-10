/**
 * App
 */
import TestModeToggle from './TestModeToggle';
import { createRoot } from '@wordpress/element';

/**
 * Render
 */
const container = document.getElementById('sc-test-mode-toggle');
const root = createRoot(container);
root.render(<TestModeToggle />);
