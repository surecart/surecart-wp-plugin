/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { warning as icon } from '@wordpress/icons';

/**
 * Block
 */
import metadata from './block.json';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';

export { metadata };
export const settings = {
	icon,
	edit,
	save,
};
