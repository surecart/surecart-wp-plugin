/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScBlockUi, ScFormControl, ScTag } from '@surecart/components-react';
import ModelSelector from '../../components/ModelSelector';

export default ({ productId, product, loading }) => {
	const [productCollections, setProductCollections] = useState([]);
	const [productCollectionIds, setProductCollectionIds] = useState([]);
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		if (product?.product_collections?.data) {
			setProductCollections(product?.product_collections?.data);
			setProductCollectionIds(
				product?.product_collections?.data?.map((c) => c.id)
			);
		}
	}, [product?.product_collections?.data]);

	const updateProductCollections = async (collectionIds) => {
		setBusy(true);
		try {
			const updatedProduct = await apiFetch({
				path: addQueryArgs(`/surecart/v1/products/${productId}`, {
					expand: ['product_collections'],
				}),
				method: 'PATCH',
				data: {
					product_collections: collectionIds,
				},
			});
			setProductCollections(updatedProduct?.product_collections?.data || []);
			setProductCollectionIds(
				updatedProduct?.product_collections?.data?.map((c) => c.id) || []
			);
		} catch (error) {
			console.log(error);
		} finally {
			setBusy(false);
		}
	};

	const renderCollectionPill = (collection) => {
		if (!collection) return;

		return (
			<ScTag
				key={`collection-pill-${collection.id}`}
				pill
				clearable
				onScClear={async () =>
					await updateProductCollections(
						productCollectionIds.filter(
							(id) => id !== collection.id
						)
					)
				}
			>
				{collection.name}
			</ScTag>
		);
	};

	const onSelectCollection = async (collectionId) => {
		if (productCollectionIds.includes(collectionId)) {
			await updateProductCollections(
				productCollectionIds.filter((id) => id !== collectionId)
			);
		} else {
			await updateProductCollections(
				productCollectionIds.concat(collectionId)
			);
		}
	};

	return (
		<Box loading={loading} title={__('Collections', 'surecart')}>
			<ScFormControl label={__('Select Product Collections', 'surecart')}>
				{!!productCollections.length && (
					<div
						css={css`
							display: flex;
							flex-wrap: wrap;
							justify-content: flex-start;
							gap: 0.25em;
							padding: var(--sc-input-spacing-small);
						`}
					>
						{productCollections.map((collection) =>
							renderCollectionPill(collection)
						)}
					</div>
				)}

				<ModelSelector
					name="product-collection"
					onSelect={(collectionId) =>
						onSelectCollection(collectionId)
					}
					exclude={productCollectionIds}
				/>
			</ScFormControl>
			{busy && (
				<ScBlockUi
					style={{ '--sc-block-ui-opacity': '0.25' }}
					spinner
				/>
			)}
		</Box>
	);
};
