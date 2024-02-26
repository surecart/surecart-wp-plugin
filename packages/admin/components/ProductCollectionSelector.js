/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import ModelSelector from './ModelSelector';

export default (props) => {
	const [query, setQuery] = useState(null);

	const { collections, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product_collection',
				{
					query,
				},
			];
			return {
				collections: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[query]
	);

	console.log('collections', collections);

	const toggleCollection = (collectionId) => {
		console.log('toggleCollection', collectionId);
	};

	return (
		<ModelSelector
			placeholder={__('Add this product to a collection...', 'surecart')}
			name="product-collection"
			onSelect={(collectionId) => toggleCollection(collectionId)}
			onChangeQuery={(value) => setSuggestion(value)}
			style={{ width: '100%' }}
			{...props}
		></ModelSelector>
	);
};
