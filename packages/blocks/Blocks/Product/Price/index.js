/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import icon from './icon';
import metadata from './block.json';
import replace from './replace';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit: replace,
};
