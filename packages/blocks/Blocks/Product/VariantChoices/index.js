/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import { settings as icon } from '@wordpress/icons';
import edit from './edit';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	edit,
};
