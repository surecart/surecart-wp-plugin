/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import './styles.scss';
/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	edit,
});
