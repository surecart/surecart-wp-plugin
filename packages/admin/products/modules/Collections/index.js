/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import { ScFormControl } from '@surecart/components-react';
import ModelSelector from '../../../components/ModelSelector';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import Collection from './Collection';

export default ({ product, updateProduct, loading }) => {
	const { receiveEntityRecords } = useDispatch(coreStore);

	// when product collections come in, update the product collection ids for updating later.
	useEffect(() => {
		receiveEntityRecords('surecart', 'product', {
			...product,
			product_collection_ids: (
				product?.product_collections?.data || []
			)?.map((c) => c.id),
		});
	}, [product?.product_collections?.data]);

	// toggle collection (add or remmove id from `product_collection_ids`)
	const toggleCollection = async (collectionId) => {
		updateProduct({
			product_collection_ids: (
				product?.product_collection_ids || []
			).includes(collectionId)
				? product?.product_collection_ids.filter(
						(id) => id !== collectionId
				  ) // remove.
				: [...(product?.product_collection_ids || []), collectionId], // add.
		});
	};

	return (
		<Box loading={loading} title={__('Collections', 'surecart')}>
			<ScFormControl label={__('Select Product Collections', 'surecart')}>
				<div
					css={css`
						display: grid;
						gap: 0.5em;
					`}
				>
					<ModelSelector
						placeholder={__('Add a product collection', 'surecart')}
						name="product-collection"
						onSelect={(collectionId) =>
							toggleCollection(collectionId)
						}
						exclude={product?.product_collection_ids}
					/>
					{!!product?.product_collection_ids?.length && (
						<div
							css={css`
								display: flex;
								flex-wrap: wrap;
								justify-content: flex-start;
								gap: 0.25em;
							`}
						>
							{product?.product_collection_ids.map((id) => (
								<Collection
									key={id}
									id={id}
									onRemove={() => toggleCollection(id)}
								/>
							))}
						</div>
					)}
				</div>
			</ScFormControl>
		</Box>
	);
};
