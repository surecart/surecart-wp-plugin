/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScBlockUi, ScButton, ScEmpty, ScIcon, ScSpacing } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Box from '../../../ui/Box';
import List from './List';
import NewPrice from './NewPrice';
import ShowArchivedToggle from './ShowArchivedToggle';

export default ({ product, productId }) => {
	const [newPriceModal, setNewPriceModal] = useState(false);
	const [showArchived, setShowArchived] = useState(false);

	const { active, archived, updating, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				{ context: 'edit', product_ids: [productId], per_page: 100 },
			];

			// get all prices for this product.
			const prices = select(coreStore).getEntityRecords(...queryArgs);

			// are we loading prices?
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);

			// are we saving any prices?
			const saving = (prices || []).some((price) =>
				select(coreStore).isSavingEntityRecord(
					'surecart',
					'price',
					price?.id
				)
			);

			const deleting = (prices || []).some((price) =>
				select(coreStore)?.isDeletingEntityRecord?.(
					'surecart',
					'price',
					price?.id
				)
			);

			// for all prices, merge with edits
			// we always show the edited version of the price.
			const editedPrices = (prices || [])
				.map((price) => {
					return {
						...price,
						...select(coreStore).getRawEntityRecord(
							'surecart',
							'price',
							price?.id
						),
						...select(coreStore).getEntityRecordEdits(
							'surecart',
							'price',
							price?.id
						),
					};
				})
				// sort by position.
				.sort((a, b) => a?.position - b?.position);

			return {
				active: (editedPrices || []).filter((price) => !price.archived),
				archived: (editedPrices || []).filter(
					(price) => price.archived
				),
				loading: loading && !prices?.length,
				updating: (loading && prices?.length) || saving || deleting,
			};
		},
		[productId]
	);

	const footer = () => {
		if (!archived?.length && !active?.length) {
			return null;
		}

		return (
			<>
				{!!active?.length && (
					<ScButton onClick={() => setNewPriceModal(true)}>
						<ScIcon name="plus" slot="prefix"></ScIcon>
						{__('Add Another Price', 'surecart')}
					</ScButton>
				)}

				{!!archived?.length && (
					<ShowArchivedToggle
						prices={archived}
						show={showArchived}
						setShow={setShowArchived}
					/>
				)}
			</>
		);
	};

	return (
		<>
			<Box
				title={__('Pricing', 'surecart')}
				loading={loading}
				footer={footer()}
			>
				<div
					css={css`
						display: grid;
						gap: 1em;
					`}
				>
					<List prices={active} product={product}>
						<ScEmpty icon="shopping-bag">
							<ScSpacing>
								<p
									css={css`
										font-size: 14px;
									`}
								>
									{__(
										'Set up pricing for your product.',
										'surecart'
									)}
								</p>
								<ScButton
									onClick={() => setNewPriceModal(true)}
								>
									<ScIcon name="plus" slot="prefix"></ScIcon>
									{__('Add A Price', 'surecart')}
								</ScButton>
							</ScSpacing>
						</ScEmpty>
					</List>

					{!!archived?.length && (
						<div
							css={css`
								display: grid;
								gap: var(--sc-spacing-medium);
							`}
						>
							{!!showArchived && (
								<List prices={archived} product={product} />
							)}
						</div>
					)}
				</div>
				{updating && <ScBlockUi spinner></ScBlockUi>}
			</Box>

			{!!newPriceModal && product?.id && (
				<NewPrice
					onRequestClose={() => setNewPriceModal(false)}
					product={product}
				/>
			)}
		</>
	);
};
