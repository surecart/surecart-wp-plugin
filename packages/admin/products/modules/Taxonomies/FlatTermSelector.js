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
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import Term from './Term';
import NewCollection from '../Collections/NewCollection';

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
	const [values, setValues] = useState([]);
	const [modal, setModal] = useState(false);
	const { editEntityRecord } = useDispatch(coreStore);
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
		[slug]
	);

	// Update terms state only after the selectors are resolved.
	// We're using this to avoid terms temporarily disappearing on slow networks
	// while core data makes REST API requests.
	useEffect(() => {
		if (hasResolvedTerms) {
			const newValues = (terms ?? []).map((term) => term.id);
			setValues(newValues);
		}
	}, [terms, hasResolvedTerms]);

	const toggleCollection = (collectionId) => {
		// Optimistically update term values.
		// The selector will always re-fetch terms later.
		setValues(
			termIds.includes(collectionId)
				? termIds.filter((id) => id !== collectionId)
				: [...termIds, parseInt(collectionId)]
		);

		editEntityRecord('postType', 'sc_product', post?.id, {
			[taxonomy.rest_base]: values,
		});
	};

	// no action available.
	if (!hasAssignAction) {
		return null;
	}

	return (
		<>
			<Box
				loading={loading}
				title={taxonomy?.labels?.name}
				footer={
					<ModelSelector
						searchPlaceholder={taxonomy?.labels?.search_items}
						kind="taxonomy"
						name={slug}
						onSelect={(collectionId) =>
							toggleCollection(parseInt(collectionId))
						}
						exclude={termIds}
						style={{ width: '100%' }}
					>
						{hasCreateAction && (
							<div slot="prefix">
								<ScMenuItem onClick={() => setModal('new')}>
									<ScIcon slot="prefix" name="plus" />
									{__('Add New', 'surecart')}
								</ScMenuItem>
								<ScMenuDivider />
							</div>
						)}

						<ScButton slot="trigger">
							<ScIcon name="plus" slot="prefix" />
							{taxonomy?.labels?.add_new_item}
						</ScButton>
					</ModelSelector>
				}
			>
				{!!values?.length && (
					<div
						css={css`
							display: flex;
							flex-wrap: wrap;
							justify-content: flex-start;
							gap: 0.25em;
						`}
					>
						{values.map((id) => (
							<Term
								key={id}
								id={id}
								slug={slug}
								onToggle={() => toggleCollection(id)}
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
