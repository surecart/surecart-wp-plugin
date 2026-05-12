/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { box as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import save from './save';
import metadata from './block.json';

import './style.scss';

/**
 * Register the block.
 */
registerBlockType(metadata.name, {
	edit,
	save,
	icon,
});
