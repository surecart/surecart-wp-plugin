/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScBlockUi, ScFormControl, ScTag } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import ModelSelector from '../../components/ModelSelector';

export default ({ productId, loading }) => {
	const { invalidateResolutionForStore, saveEntityRecord } =
		useDispatch(coreStore);
	const [busy, setBusy] = useState(false);

	/**
	 * Get product collections and make for select.
	 * Fetch the 100 most recent product collections.
	 */
	const { productCollections, productCollectionIds, loadingCollectionLists } =
		useSelect(
			(select) => {
				const queryArgs = [
					'surecart',
					'product-collection',
					{
						context: 'edit',
						per_page: 100,
						product_ids: [productId],
					},
				];

				const uniqueSet = new Set();
				const allCollectionLists =
					select(coreStore).getEntityRecords(...queryArgs) || [];

				const uniqueCollections = allCollectionLists.filter(
					(collection) => {
						const isPresent = uniqueSet.has(collection.id);
						uniqueSet.add(collection.id);
						return !isPresent;
					}
				);

				return {
					productCollections: uniqueCollections,
					productCollectionIds: uniqueCollections.map(
						(collection) => collection.id
					),
					loadingCollectionLists: select(coreStore).isResolving(
						'getEntityRecords',
						queryArgs
					),
				};
			},
			[productId]
		);

	const updateProductCollections = async (collectionIds) => {
		setBusy(true);
		try {
			await saveEntityRecord(
				'surecart',
				'product',
				{
					id: productId,
					product_collections: collectionIds,
				},
				{ throwOnError: true }
			);

			await invalidateResolutionForStore();
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
		<Box
			loading={loading || loadingCollectionLists}
			title={__('Collections', 'surecart')}
		>
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
