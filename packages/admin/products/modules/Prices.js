/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __, sprintf } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

import Box from '../../ui/Box';
import Price from '../components/price/index.js';
import { ScButton, ScSwitch } from '@surecart/components-react';
import NewPrice from '../components/NewPrice';

export default ({ product, productId }) => {
	const [newPriceModal, setNewPriceModal] = useState(false);
	const [showArchived, setShowArchived] = useState(false);

	const { prices, loading } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'price',
				{ context: 'edit', product_ids: [productId], archived: false },
			];
			return {
				prices: select(coreStore).getEntityRecords(...queryArgs),
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[productId]
	);

	const archivedPrices = (prices || []).filter((price) => !!price.archived);
	const activePrices = (prices || []).filter((price) => !price.archived);

	const renderPrices = () => {
		return (
			<div
				css={css`
					display: grid;
					gap: 1em;
				`}
			>
				{!activePrices?.length && (
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
							<ScButton onClick={() => setNewPriceModal(true)}>
								<sc-icon name="plus" slot="prefix"></sc-icon>
								{__('Add A Price', 'surecart')}
							</ScButton>
						</sc-spacing>
					</sc-empty>
				)}

				{renderPriceList(prices)}

				{!!archivedPrices?.length && (
					<div
						css={css`
							> *:not(:last-child) {
								margin-bottom: 20px;
							}
						`}
					>
						{!!showArchived && renderPriceList(archivedPrices)}
					</div>
				)}
			</div>
		);
	};

	const renderPriceList = (list = []) => {
		return (list || []).map((price, index) => {
			return (
				<Price
					price={price}
					prices={prices}
					product={product}
					index={index}
					key={price?.id}
				/>
			);
		});
	};

	return (
		<div>
			<Box
				title={__('Pricing', 'surecart')}
				description={!prices?.length ? __('Please add a price.') : ''}
				loading={loading}
				footer={
					!loading && (
						<Fragment>
							{!!prices?.length && (
								<ScButton
									onClick={() => setNewPriceModal(true)}
								>
									<svg
										slot="prefix"
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<line
											x1="12"
											y1="5"
											x2="12"
											y2="19"
										></line>
										<line
											x1="5"
											y1="12"
											x2="19"
											y2="12"
										></line>
									</svg>
									{__('Add Another Price', 'surecart')}
								</ScButton>
							)}
							{!!archivedPrices?.length && (
								<div
									css={css`
										display: flex;
										justify-content: flex-end;
									`}
								>
									<ScSwitch
										checked={!!showArchived}
										onClick={(e) => {
											e.preventDefault();
											setShowArchived(!showArchived);
										}}
									>
										{sprintf(
											!showArchived
												? __(
														'Show %d Archived Prices',
														'surecart'
												  )
												: __(
														'Hide %d Archived Prices',
														'surecart'
												  ),
											archivedPrices?.length
										)}
									</ScSwitch>
								</div>
							)}
						</Fragment>
					)
				}
			>
				{renderPrices()}
			</Box>

			{!!newPriceModal && product?.id && (
				<NewPrice
					onRequestClose={() => setNewPriceModal(false)}
					productId={product?.id}
				/>
			)}
		</div>
	);
};
