/**
 * WordPress dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { listView as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import edit from './edit';
import metadata from './block.json';
import './style.scss';

registerBlockType(metadata.name, {
	edit,
	icon,
});
