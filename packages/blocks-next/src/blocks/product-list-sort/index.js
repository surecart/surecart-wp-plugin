/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { addSubmenu as icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit,
	__experimentalLabel: () => __('Sort', 'surecart'),
});
