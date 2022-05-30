/** @jsx jsx */
import { css, jsx } from '@emotion/core';

// wordpress.
import { __ } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

// components.
import { ScButton } from '@surecart/components-react';
import Box from '../../../ui/Box';
import NewPrice from './NewPrice';
import List from './List';
import ShowArchivedToggle from './ShowArchivedToggle';

export default ({ product, productId, loading }) => {
	const [newPriceModal, setNewPriceModal] = useState(false);
	const [showArchived, setShowArchived] = useState(false);

	const { activePrices, archivedPrices, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				{ context: 'edit', product_ids: [productId], per_page: 100 },
			];
			const prices = select(coreStore).getEntityRecords(...queryArgs);
			return {
				activePrices: (prices || []).filter((price) => !price.archived),
				archivedPrices: (prices || []).filter(
					(price) => price.archived
				),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
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
				{fetching && <sc-block-ui spinner></sc-block-ui>}
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
