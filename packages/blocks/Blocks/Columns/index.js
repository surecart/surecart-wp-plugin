/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { columns as icon } from '@wordpress/icons';

import metadata from './block.json';
import deprecated from './deprecated';
/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import variations from './variations';

const { name } = metadata;

export { metadata, name };

export const settings = {
	icon,
	variations,
	edit,
	save,
  deprecated
};
