/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { tag as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

registerBlockType(metadata.name, {
	edit,
	icon,
});
