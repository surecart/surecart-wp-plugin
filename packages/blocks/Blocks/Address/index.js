/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { pin as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import deprecated from './deprecated';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit,
	deprecated,
};
