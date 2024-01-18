/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { store as icon } from '@wordpress/icons';

/**
 * Store entities
 */
import './entities';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

const { name } = metadata;
export { metadata, name };

export const settings = {
	icon,
	edit,
	save,
};
