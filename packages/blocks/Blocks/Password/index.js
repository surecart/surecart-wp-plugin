/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import icon from './icon';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit,
};
