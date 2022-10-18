/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon: (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			stroke="currentColor"
			style={{ fill: 'none' }}
		>
			<circle cx="9" cy="21" r="1" strokeWidth={2}></circle>
			<circle cx="20" cy="21" r="1" strokeWidth={2}></circle>
			<path
				d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
				strokeWidth={2}
			></path>
		</svg>
	),
	edit,
	save,
};
