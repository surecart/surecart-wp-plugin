/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { grid as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import replace from './replace';
const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit: replace,
};
