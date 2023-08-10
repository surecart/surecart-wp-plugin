/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import {
	ScButton,
	ScIcon,
	ScMenuDivider,
	ScMenuItem,
} from '@surecart/components-react';
import ModelSelector from '../../../components/ModelSelector';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import Collection from './Collection';
import NewCollection from './NewCollection';

export default ({ product, updateProduct, loading }) => {
	const [modal, setModal] = useState(false);
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
		if (!collectionId) return;
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
		<>
			<Box
				loading={loading}
				title={__('Collections', 'surecart')}
				footer={
					<ModelSelector
						placeholder={__(
							'Add this product to a collection...',
							'surecart'
						)}
						name="product-collection"
						onSelect={(collectionId) =>
							toggleCollection(collectionId)
						}
						exclude={product?.product_collection_ids}
						style={{ width: '100%' }}
					>
						<div slot="prefix">
							<ScMenuItem onClick={() => setModal('new')}>
								<ScIcon slot="prefix" name="plus" />
								{__('Add New', 'surecart')}
							</ScMenuItem>
							<ScMenuDivider />
						</div>

						<ScButton slot="trigger">
							<ScIcon name="plus" slot="prefix" />
							{__('Add To Collection', 'surecart')}
						</ScButton>
					</ModelSelector>
				}
			>
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
			</Box>
			<NewCollection
				open={'new' === modal}
				onRequestClose={() => setModal(false)}
				onCreate={(collection) => toggleCollection(collection.id)}
			/>
		</>
	);
};
