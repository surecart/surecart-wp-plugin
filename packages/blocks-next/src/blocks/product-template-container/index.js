/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { columns as icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';

/**
 * Styles
 */
import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit,
	save,
	__experimentalLabel: () => __('Main', 'surecart'),
});
