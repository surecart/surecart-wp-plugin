/**
 * External dependencies.
 */
import { registerBlockType } from '@wordpress/blocks';
import { percent as icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import edit from './edit';
import metadata from './block.json';
import './style.scss';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit,
	__experimentalLabel: () => __('Discount Badge', 'surecart'),
});
