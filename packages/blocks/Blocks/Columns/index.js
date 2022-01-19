/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { columns as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import variations from './variations';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	variations,
	edit,
	save,
};
