import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

const FALLBACK_COLLECTIONS = [
	{ id: '1', name: 'Collection' },
	{ id: '2', name: 'Collection 2' },
	{ id: '3', name: 'Collection 3' },
];

export default () => {
	const collections = useSelect((select) =>
		select(coreStore).getEntityRecords('surecart', 'product-collection')
	);

	return (
		<select className="sc-dropdown">
			<option value="">{__('Filter', 'surecart')}</option>
			{(collections?.length ? collections : FALLBACK_COLLECTIONS).map(
				(collection) =>
					collection.id && (
						<option key={collection.id} value={collection.id}>
							{collection.name}
						</option>
					)
			)}
		</select>
	);
};
