/**
 * External dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies.
 */
import edit from './edit';
import metadata from './block.json';
import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			width="16"
			height="16"
			viewBox="0 0 28 28"
			stroke="currentColor"
			style={{ fill: 'none' }}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
			<line x1="3" y1="6" x2="21" y2="6"></line>
			<path d="M16 10a4 4 0 0 1-8 0"></path>
		</svg>
	),
	edit,
});
