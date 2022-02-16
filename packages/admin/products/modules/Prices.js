/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __, sprintf } from '@wordpress/i18n';
import { useState, Fragment } from '@wordpress/element';

import Box from '../../ui/Box';
import Price from '../components/price/index.js';

import {
	CeButton,
	CeChoice,
	CeChoices,
	CeSwitch,
} from '@checkout-engine/components-react';
import useEntities from '../../mixins/useEntities';
import useCurrentPage from '../../mixins/useCurrentPage';
import { useEffect } from 'react';
import ErrorFlash from '../../components/ErrorFlash';
import useEntity from '../../mixins/useEntity';

export default ({ product, updateProduct, loading }) => {
	const { id } = useCurrentPage();
	const { prices, draftPrices, addPrice } = useEntities('price');
	const archivedPrices = (prices || []).filter((price) => !!price.archived);
	const activePrices = (prices || []).filter((price) => !price.archived);

	const [open, setOpen] = useState();
	const [showArchived, setShowArchived] = useState(false);
	const { priceErrors, clearPriceErrors } = useEntity('price');

	useEffect(() => {
		if (!id) {
			addPrice({
				recurring: false,
				recurring_interval: 'month',
				currency: ceData?.currency_code || 'usd',
				recurring_interval_count: 1,
				archived: false,
			});
		}
	}, [id]);

	const renderPrices = () => {
		return (
			<div
				css={css`
					display: grid;
					gap: 3em;
				`}
			>
				{renderPriceList(activePrices)}
				{renderPriceList(draftPrices)}

				{!!archivedPrices?.length && (
					<div
						css={css`
							> *:not(:last-child) {
								margin-bottom: 20px;
							}
						`}
					>
						{!!showArchived && renderPriceList({ archived: true })}
					</div>
				)}
			</div>
		);
	};

	const renderPriceList = (list) => {
		return (list || []).map((price, index) => {
			return (
				<Price
					price={price}
					prices={[...prices, ...draftPrices]}
					product={product}
					index={index}
					key={index}
					focused={index === open}
				/>
			);
		});
	};

	const shouldShowButton =
		[...activePrices, ...draftPrices]?.length < 1 || product?.recurring;

	return (
		<div>
			<Box
				title={__('Pricing', 'checkout_engine')}
				description={
					!activePrices?.length ? __('Please add a price.') : ''
				}
				loading={loading}
				footer={
					!loading &&
					(shouldShowButton || archivedPrices?.length) && (
						<Fragment>
							{shouldShowButton && (
								<CeButton
									onClick={(e) => {
										e.preventDefault();
										addPrice({
											product: id,
											recurring: false,
											recurring_interval: 'month',
											currency:
												ceData?.currency_code || 'usd',
											recurring_interval_count: 1,
											archived: false,
										});
										setOpen(prices?.length);
									}}
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
									{__('Add Another Price', 'checkout_engine')}
								</CeButton>
							)}
							{!!archivedPrices?.length && (
								<div
									css={css`
										display: flex;
										justify-content: flex-end;
									`}
								>
									<CeSwitch
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
														'checkout_engine'
												  )
												: __(
														'Hide %d Archived Prices',
														'checkout_engine'
												  ),
											archivedPrices?.length
										)}
									</CeSwitch>
								</div>
							)}
						</Fragment>
					)
				}
			>
				<ErrorFlash errors={priceErrors} onHide={clearPriceErrors} />
				{!id && (
					<CeChoices
						css={css`
							margin-bottom: 1em;
						`}
						required
						label={__('Product Type', 'checkout_engine')}
						style={{ '--columns': 2 }}
					>
						<div>
							<CeChoice
								checked={!product?.recurring}
								value="single"
								onCeChange={(e) => {
									if (!e.target.checked) return;
									updateProduct({ recurring: false });
								}}
							>
								{__('Single Payment', 'checkout_engine')}
								<span slot="description">
									{__(
										'Charge a one-time fee.',
										'checkout_engine'
									)}
								</span>
							</CeChoice>
							<CeChoice
								checked={product?.recurring}
								value="subscription"
								onCeChange={(e) => {
									if (!e.target.checked) return;
									updateProduct({
										recurring: true,
									});
								}}
							>
								{__('Subscription', 'checkout_engine')}
								<span slot="description">
									{__(
										'Charge an ongoing fee.',
										'checkout_engine'
									)}
								</span>
							</CeChoice>
						</div>
					</CeChoices>
				)}
				{renderPrices()}
			</Box>
		</div>
	);
};
