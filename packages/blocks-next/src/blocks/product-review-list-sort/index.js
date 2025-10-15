/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies.
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Block style.
 */
import './style.scss';

registerBlockType(metadata.name, {
	edit,
});
