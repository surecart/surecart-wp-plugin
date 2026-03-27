/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { filter as icon } from '@wordpress/icons';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import save from './save';

/**
 * Styles
 */
import './style.scss';

/**
 * Components
 */
import FilterTagsMigration from './FilterTagsMigration';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit: ({ clientId }) => {
		const childBlocks = select('core/block-editor').getBlocks(clientId);
		if (
			childBlocks.length === 0 ||
			childBlocks[0]?.name !== 'surecart/product-list-filter-tag'
		) {
			return <Edit />;
		}
		return <FilterTagsMigration clientId={clientId} />;
	},
	save,
});
