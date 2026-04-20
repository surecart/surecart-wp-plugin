/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { image as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

import './style.scss';

/**
 * Register the block.
 */
registerBlockType(metadata.name, {
	edit,
	icon,
});
