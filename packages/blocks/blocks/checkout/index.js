/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

export { metadata };
export const settings = {
	icon,
	edit,
	save,
};
