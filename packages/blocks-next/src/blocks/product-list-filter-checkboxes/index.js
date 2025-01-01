/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { check as icon } from '@wordpress/icons';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import './style.scss';
import { store as coreStore } from '@wordpress/core-data';
import { select } from '@wordpress/data';

/**
 * Every block starts by registering a new block type definition.
 */
registerBlockType(metadata.name, {
	icon,
	edit,
	save,
	__experimentalLabel: (attributes) => {
		const taxonomies = select(coreStore).getEntityRecords(
			'root',
			'taxonomy',
			{
				per_page: -1,
			}
		);

		if (!taxonomies) return false;

		const taxonomy = taxonomies.find(
			(t) => t.slug === attributes?.taxonomy
		);

		if (!taxonomy || !taxonomy?.name) return false;

		return sprintf(
			'%s Checkboxes',
			taxonomy.labels?.singular_name ?? taxonomy.name
		);
	},
});
