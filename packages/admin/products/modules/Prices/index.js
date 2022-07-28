/** @jsx jsx */
import { css, jsx } from '@emotion/core';
// components.
import { ScButton } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { Fragment, useState } from '@wordpress/element';
// wordpress.
import { __ } from '@wordpress/i18n';

import Box from '../../../ui/Box';
import List from './List';
import NewPrice from './NewPrice';
import ShowArchivedToggle from './ShowArchivedToggle';

export default ({ product, productId }) => {
	const [newPriceModal, setNewPriceModal] = useState(false);
	const [showArchived, setShowArchived] = useState(false);

	const { activePrices, archivedPrices, updating, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				{ context: 'edit', product_ids: [productId], per_page: 100 },
			];
			const prices = select(coreStore).getEntityRecords(...queryArgs);
			const loading = select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			);
			return {
				activePrices: (prices || []).filter((price) => !price.archived),
				archivedPrices: (prices || []).filter(
					(price) => price.archived
				),
				loading: loading && !prices?.length,
				updating: loading && prices?.length,
			};
		},
		[productId]
	);

	const footer = () => {
		if (!archivedPrices?.length && !activePrices?.length) {
			return null;
		}

		return (
			<>
				{!!activePrices?.length && (
					<ScButton onClick={() => setNewPriceModal(true)}>
						<sc-icon name="plus" slot="prefix"></sc-icon>
						{__('Add Another Price', 'surecart')}
					</ScButton>
				)}

				{!!archivedPrices?.length && (
					<ShowArchivedToggle
						prices={archivedPrices}
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
					<List prices={activePrices} product={product}>
						<sc-empty icon="shopping-bag">
							<sc-spacing>
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
									<sc-icon
										name="plus"
										slot="prefix"
									></sc-icon>
									{__('Add A Price', 'surecart')}
								</ScButton>
							</sc-spacing>
						</sc-empty>
					</List>

					{!!archivedPrices?.length && (
						<div
							css={css`
								> *:not(:last-child) {
									margin-bottom: 20px;
								}
							`}
						>
							{!!showArchived && (
								<List
									prices={archivedPrices}
									product={product}
								/>
							)}
						</div>
					)}
				</div>
				{updating && <sc-block-ui spinner></sc-block-ui>}
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
