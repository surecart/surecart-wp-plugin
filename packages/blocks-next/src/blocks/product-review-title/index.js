/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { title as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
	icon,
	edit,
});
