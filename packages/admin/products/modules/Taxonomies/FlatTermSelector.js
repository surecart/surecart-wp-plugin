/** @jsx jsx */
/**
 * External dependencies.
 */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScIcon,
	ScMenuDivider,
	ScMenuItem,
} from '@surecart/components-react';
import Box from '../../../ui/Box';
import ModelSelector from '../../../components/ModelSelector';
import Term from './Term';
import NewTaxonomy from './NewTaxonomy';

/**
 * Module constants
 */
const DEFAULT_QUERY = {
	per_page: 20,
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
			const termIds = taxonomy ? post?.[taxonomy?.rest_base] : [];

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
					: [],
				hasResolvedTerms: hasFinishedResolution('getEntityRecords', [
					'taxonomy',
					slug,
					query,
				]),
			};
		},
		[slug, post]
	);

	// Update terms state only after the selectors are resolved.
	// We're using this to avoid terms temporarily disappearing on slow networks
	// while core data makes REST API requests.
	useEffect(() => {
		if (hasResolvedTerms) {
			const newValues = (terms ?? []).map((term) => term.id);
			setValues(Array.from(new Set([...(values || []), ...newValues])));
		}
	}, [terms, hasResolvedTerms]);

	const toggleTerm = (id) => {
		const newValues = values.includes(id)
			? values.filter((vid) => vid !== parseInt(id))
			: [...values, parseInt(id)];

		// Optimistically update term values.
		// The selector will always re-fetch terms later.
		setValues(newValues);

		// Update the post with the new term values.
		editEntityRecord('postType', 'sc_product', post?.id, {
			[taxonomy.rest_base]: newValues,
		});
	};

	// no action available.
	if (!hasAssignAction) {
		return null;
	}

	return (
		<>
			<Box
				loading={loading && !hasResolvedTerms}
				title={taxonomy?.labels?.name}
				footer={
					<ModelSelector
						searchPlaceholder={taxonomy?.labels?.search_items}
						kind="taxonomy"
						name={slug}
						onSelect={(id) => toggleTerm(parseInt(id))}
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
								onToggle={() => toggleTerm(id)}
							/>
						))}
					</div>
				)}
			</Box>

			<NewTaxonomy
				open={'new' === modal}
				taxonomy={taxonomy}
				onRequestClose={() => setModal(false)}
				onCreate={(collection) => toggleTerm(collection.id)}
			/>
		</>
	);
};
