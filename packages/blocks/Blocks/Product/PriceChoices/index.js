/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import icon from './icon';
import edit from './edit';
import replace from './replace';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit: replace,
};
