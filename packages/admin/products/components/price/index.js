/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

import {
	CeInput,
	CePriceInput,
	CeSwitch,
	CeFormControl,
	CeTooltip,
	CeSelect,
} from '@checkout-engine/components-react';
import Header from './Header';

// hocs
import withConfirm from '../../../hocs/withConfirm';
import useEntity from '../../../mixins/useEntity';
import ConditionalWrapper from '../../../components/ConditionalWrapper';

export default withConfirm(({ price: priceEntity, prices, product, index }) => {
	const { price, updatePrice, deletePrice, priceErrors, clearPriceErrors } =
		useEntity('price', priceEntity?.id, index);

	const [isOpen, setIsOpen] = useState(true);

	// if invalid, toggle open.
	useEffect(() => {
		if (priceErrors?.length) {
			setIsOpen(true);
		}
	}, [priceErrors]);

	const hasHeader = prices?.length > 1;

	const showLifetime = () => {
		// need to be a recurring product
		if (!product?.recurring) return false;
		if (!price?.id) return true;
		return price?.recurring_interval === 'never';
	};

	return (
		<div>
			{hasHeader && (
				<Header
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					price={price}
					onArchive={() =>
						updatePrice({
							archived: !price.archived,
						})
					}
					onDelete={() => deletePrice()}
				/>
			)}
			<div
				css={css`
					display: grid;
					gap: var(--ce-form-row-spacing);
					margin-top: ${isOpen && hasHeader ? '1em' : '0'};
					height: ${isOpen ? 'auto' : 0};
					overflow: ${isOpen ? 'visible' : 'hidden'};
					visibility: ${isOpen ? 'visibile' : 'hidden'};
				`}
			>
				{!price?.ad_hoc && (
					<ce-flex>
						<CePriceInput
							css={css`
								flex: 1 1 75%;
							`}
							label={__('Price', 'checkout_engine')}
							className="ce-price-amount"
							currencyCode={ceData.currecy_code}
							value={price?.amount}
							name="price"
							onCeChange={(e) => {
								updatePrice({ amount: e.target.value });
							}}
							required
						/>
						{product?.recurring &&
							price?.recurring_interval !== 'never' && (
								<ConditionalWrapper
									condition={price?.id}
									wrapper={(children) => (
										<CeTooltip
											text={
												price?.id
													? __(
															'To change the interval, create a new price.',
															'checkout_engine'
													  )
													: null
											}
										>
											{children}
										</CeTooltip>
									)}
								>
									<CeFormControl
										css={css`
											flex: 1;
										`}
										disabled={price?.id}
										label={__(
											'Repeat Payment Every',
											'checkout_engine'
										)}
									>
										<div
											css={css`
												display: flex;
												align-items: center;
												gap: 0.5em;
											`}
										>
											<CeInput
												disabled={price?.id}
												value={
													price?.recurring_interval_count
												}
												onCeChange={(e) =>
													updatePrice({
														recurring_interval_count:
															e.target.value,
													})
												}
												type="number"
												max={
													price?.recurring_interval ===
													'year'
														? 1
														: null
												}
												required
											/>
											<CeSelect
												value={
													price?.recurring_interval
												}
												onCeChange={(e) =>
													updatePrice({
														recurring_interval:
															e.target.value,
													})
												}
												choices={[
													{
														value: 'month',
														label: __(
															'Month',
															'checkout_engine'
														),
													},
													{
														value: 'year',
														label: __(
															'Year',
															'checkout_engine'
														),
													},
													{
														value: 'never',
														label: __(
															'Lifetime',
															'checkout_engine'
														),
													},
												]}
											/>
										</div>
									</CeFormControl>
								</ConditionalWrapper>
							)}
					</ce-flex>
				)}

				{!!price?.ad_hoc && (
					<div
						css={css`
							display: grid;
							gap: var(--ce-form-row-spacing);
						`}
					>
						<CePriceInput
							label={__('Min Amount', 'checkout_engine')}
							className="ce-ad-hoc-min-amount"
							value={price?.ad_hoc_min_amount}
							onCeChange={(e) =>
								updatePrice({
									ad_hoc_min_amount: e.target.value,
								})
							}
							required
						/>
						<CePriceInput
							label={__('Max Amount', 'checkout_engine')}
							className="ce-ad-hoc-max-amount"
							value={price?.ad_hoc_max_amount}
							min={price?.ad_hoc_min_amount / 100}
							onCeChange={(e) =>
								updatePrice({
									ad_hoc_max_amount: e.target.value,
								})
							}
						/>
					</div>
				)}

				{!product?.recurring && (
					<div>
						<CeSwitch
							checked={price?.ad_hoc}
							onCeChange={(e) =>
								updatePrice({ ad_hoc: e.target.checked })
							}
						>
							{__(
								'Allow customers to pay what they want',
								'checkout_engine'
							)}
						</CeSwitch>
					</div>
				)}

				{showLifetime() && (
					<div>
						<ConditionalWrapper
							condition={price?.id}
							wrapper={(children) => (
								<CeTooltip
									text={
										price?.id
											? __(
													'To change the interval, create a new price.',
													'checkout_engine'
											  )
											: null
									}
								>
									{children}
								</CeTooltip>
							)}
						>
							<CeSwitch
								disabled={price?.id}
								checked={price?.recurring_interval === 'never'}
								onCeChange={(e) =>
									updatePrice({
										recurring_interval: e.target.checked
											? 'never'
											: 'month',
									})
								}
							>
								{__('Lifetime subscription', 'checkout_engine')}
							</CeSwitch>
						</ConditionalWrapper>
					</div>
				)}

				{product?.recurring && (
					<CeInput
						label={__('Free Trial Days', 'checkout_engine')}
						className="ce-free-trial"
						help={__(
							'If you want to add a free trial, enter the number of days.',
							'checkout_engine'
						)}
						value={price?.trial_duration_days}
						onCeChange={(e) =>
							updatePrice({
								trial_duration_days: e.target.value,
							})
						}
					>
						<span slot="suffix">
							{__('Days', 'checkout_engine')}
						</span>
					</CeInput>
				)}
			</div>
		</div>
	);
});
