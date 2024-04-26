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
	ScTag,
} from '@surecart/components-react';
import ModelSelector from '../../../components/ModelSelector';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Shared reference to an empty array for cases where it is important to avoid
 * returning a new array reference on every invocation.
 *
 * @type {Array<any>}
 */
const EMPTY_ARRAY = [];

/**
 * Module constants
 */
const MAX_TERMS_SUGGESTIONS = 20;
const DEFAULT_QUERY = {
	per_page: MAX_TERMS_SUGGESTIONS,
	_fields: 'id,name',
	context: 'view',
};

export default ({ post, slug, loading }) => {
	const {
		terms,
		termIds,
		taxonomy,
		hasAssignAction,
		hasCreateAction,
		hasResolvedTerms,
	} = useSelect(
		(select) => {
			const { getEntityRecords, getTaxonomy, hasFinishedResolution } =
				select(coreStore);
			const taxonomy = getTaxonomy(slug);
			const termIds = taxonomy
				? post?.[taxonomy?.rest_base]
				: EMPTY_ARRAY;

			const query = {
				...DEFAULT_QUERY,
				include: (termIds || []).join(','),
				per_page: -1,
			};

			return {
				hasCreateAction: taxonomy
					? post?._links?.[
							'wp:action-create-' + taxonomy.rest_base
					  ] ?? false
					: false,
				hasAssignAction: taxonomy
					? post?._links?.[
							'wp:action-assign-' + taxonomy.rest_base
					  ] ?? false
					: false,
				taxonomy, // get the taxonomy.
				termIds, // get the term ids for the post.
				terms: termIds?.length
					? getEntityRecords('taxonomy', slug, query) // fetch all terms.
					: EMPTY_ARRAY,
				hasResolvedTerms: hasFinishedResolution('getEntityRecords', [
					'taxonomy',
					slug,
					query,
				]),
			};
		},
		[slug, post]
	);

	const selectedTerms = (terms || []).filter((term) =>
		termIds.includes(term.id)
	);

	// const collections = useSelect((select) => {
	// 	return (
	// 		select(coreStore).getEntityRecords('taxonomy', 'sc_collection', {
	// 			per_page: 100,
	// 			orderby: 'name',
	// 			post: post?.id,
	// 			order: 'asc',
	// 		}) || []
	// 	);
	// });

	// when product collections come in, update the product collection ids for updating later.
	// useEffect(() => {
	// 	receiveEntityRecords('surecart', 'product', {
	// 		...product,
	// 		product_collection_ids: (
	// 			product?.product_collections?.data || []
	// 		)?.map((c) => c.id),
	// 	});
	// }, [product?.product_collections?.data]);

	// toggle collection (add or remmove id from `product_collection_ids`)
	// const toggleCollection = async (collectionId) => {
	// 	if (!collectionId) return;
	// 	updateProduct({
	// 		product_collection_ids: (
	// 			product?.product_collection_ids || []
	// 		).includes(collectionId)
	// 			? product?.product_collection_ids.filter(
	// 					(id) => id !== collectionId
	// 			  ) // remove.
	// 			: [...(product?.product_collection_ids || []), collectionId], // add.
	// 	});
	// };

	return (
		<>
			<Box
				loading={loading || !hasResolvedTerms}
				title={taxonomy?.labels?.name}
				footer={
					<ModelSelector
						searchPlaceholder={taxonomy?.labels?.search_items}
						kind="taxonomy"
						name={slug}
						onSelect={(collectionId) =>
							toggleCollection(collectionId)
						}
						exclude={termIds}
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
							{taxonomy?.labels?.add_new_item}
						</ScButton>
					</ModelSelector>
				}
			>
				{!!selectedTerms?.length && (
					<div
						css={css`
							display: flex;
							flex-wrap: wrap;
							justify-content: flex-start;
							gap: 0.25em;
						`}
					>
						{selectedTerms.map(({ id, name }) => (
							<ScTag
								key={id}
								onScClear={() => toggleCollection(id)}
								clearable
							>
								{name}
							</ScTag>
						))}
					</div>
				)}
			</Box>
			{/*
			<NewCollection
				open={'new' === modal}
				onRequestClose={() => setModal(false)}
				onCreate={(collection) => toggleCollection(collection.id)}
				suggestion={suggestion}
			/> */}
		</>
	);
};
