/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { store as coreStore, useSelect } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScFormControl, ScSelect, ScTag } from '@surecart/components-react';

export default ({ loading, product, updateProduct }) => {
	const collections = product?.product_collection_ids || [];

	/**
	 * Get product collections and make for select.
	 * Fetch the 100 most recent product collections.
	 */
	const { collectionLists, loadingCollectionLists } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'product-collection',
				{
					per_page: 100,
				},
			];

			const allCollectionLists = select(coreStore).getEntityRecords(
				...queryArgs
			);

			return {
				collectionLists: allCollectionLists ? allCollectionLists.map(
					(collection) => ({ value: collection.id, label: collection.name })
				) : [],
				loadingCollectionLists: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[]
	);

	const onRemoveCollectionLink = (value) => {
		updateProduct({
			product_collection_ids: collections.filter((collection) => collection !== value)
		});
	};

	const renderCollectionPill = (collectionSelected) => {
		const collection = collectionLists.find(
			(collectionChoice) => collectionChoice.value === collectionSelected
		);

		return (
			<ScTag
				key={`collection-${collection.value}`}
				pill
				clearable
				onScClear={() => onRemoveCollectionLink(collection.value)}
			>
				{collection.label}
			</ScTag>
		);
	};

	const onSelectCollection = (e) => {
		const value = e.target.value;
		if (!value) return;

		if (collectionLists.includes(value)) {
			updateProduct({
				product_collection_ids: collectionLists.filter((collectionValue) => collectionValue !== value)
			});
		} else {
			updateProduct({
				product_collection_ids: [...collections, value]
			});
		}
	};

	const collectionChoices = collectionLists
		.filter((collection) => !collections.includes(collection.value))
		.map(
			(collection) => ({
				...collection,
				selected: false,
			})
		);

	return (
		<Box loading={loading || loadingCollectionLists} title={__('Collections', 'surecart')}>
			<ScFormControl label={__('Select Product Collections', 'surecart')}>
				{!!collections.length && (
					<div
						css={css`
								display: flex;
								flex-wrap: wrap;
								justify-content: flex-start;
								gap: 0.25em;
								padding: var(
									--sc-input-spacing-small
								);
						`}
					>
						{collections.map((collection) =>
							renderCollectionPill(collection)
						)}
					</div>
				)}

				<ScSelect
					search
					closeOnSelect={false}
					onScChange={onSelectCollection}
					choices={collectionChoices}
				/>
			</ScFormControl>
		</Box>
	);
};
