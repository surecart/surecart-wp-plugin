/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import { useState, useEffect, Fragment } from '@wordpress/element';

import {
	ScInput,
	ScPriceInput,
	ScSwitch,
	ScFormControl,
	ScTooltip,
	ScSelect,
} from '@surecart/components-react';
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

	const collapsible = prices?.length > 1;

	const showLifetime = () => {
		// need to be a recurring product
		if (!product?.recurring) return false;
		if (!price?.id) return true;
		return price?.recurring_interval === 'never';
	};

	const renderOneTime = () => {
		return (
			<Fragment>
				{!price?.ad_hoc ? (
					<ScPriceInput
						css={css`
							flex: 1 1 75%;
						`}
						label={__('Price', 'surecart')}
						className="sc-price-amount"
						showCode
						currencyCode={scData.currency_code}
						value={price?.amount}
						name="price"
						onScChange={(e) => {
							updatePrice({ amount: e.target.value });
						}}
						required
					/>
				) : (
					<div
						css={css`
							display: grid;
							gap: var(--sc-form-row-spacing);
						`}
					>
						<ScPriceInput
							label={__('Minimum Amount', 'surecart')}
							className="sc-ad-hoc-min-amount"
							value={price?.ad_hoc_min_amount}
							onScChange={(e) =>
								updatePrice({
									ad_hoc_min_amount: e.target.value,
								})
							}
						/>
						<ScPriceInput
							label={__('Maximum Amount', 'surecart')}
							className="sc-ad-hoc-max-amount"
							value={price?.ad_hoc_max_amount}
							min={price?.ad_hoc_min_amount / 100}
							onScChange={(e) =>
								updatePrice({
									ad_hoc_max_amount: e.target.value,
								})
							}
						/>
					</div>
				)}

				<div>
					<ScSwitch
						checked={price?.ad_hoc}
						onScChange={(e) =>
							updatePrice({ ad_hoc: e.target.checked })
						}
					>
						{__(
							'Allow customers to pay what they want',
							'surecart'
						)}
					</ScSwitch>
				</div>
			</Fragment>
		);
	};

	const renderRecurring = () => {
		return (
			<Fragment>
				<sc-flex>
					<ScPriceInput
						css={css`
							flex: 1 1 75%;
						`}
						label={__('Price', 'surecart')}
						className="sc-price-amount"
						currencyCode={scData.currecy_code}
						value={price?.amount}
						name="price"
						onScChange={(e) => {
							updatePrice({ amount: e.target.value });
						}}
						required
					/>
					{price?.recurring_interval !== 'never' && (
						<ConditionalWrapper
							condition={price?.id}
							wrapper={(children) => (
								<ScTooltip
									type="text"
									text={
										price?.id
											? __(
													'To change the interval, create a new price.',
													'surecart'
											  )
											: null
									}
								>
									{children}
								</ScTooltip>
							)}
						>
							<ScFormControl
								css={css`
									flex: 1;
								`}
								disabled={price?.id}
								label={__('Repeat Payment Every', 'surecart')}
							>
								<div
									css={css`
										display: flex;
										align-items: center;
										gap: 0.5em;
									`}
								>
									<ScInput
										disabled={price?.id}
										value={price?.recurring_interval_count}
										onScChange={(e) =>
											updatePrice({
												recurring_interval_count:
													e.target.value,
											})
										}
										type="number"
										max={
											price?.recurring_interval === 'year'
												? 1
												: null
										}
										required
									/>
									<ScSelect
										value={price?.recurring_interval}
										disabled={price?.id}
										onScChange={(e) =>
											updatePrice({
												recurring_interval:
													e.target.value,
											})
										}
										choices={[
											{
												value: 'month',
												label: __('Month', 'surecart'),
											},
											{
												value: 'year',
												label: __('Year', 'surecart'),
											},
											{
												value: 'never',
												label: __(
													'Lifetime',
													'surecart'
												),
											},
										]}
									/>
								</div>
							</ScFormControl>
						</ConditionalWrapper>
					)}
				</sc-flex>
				{showLifetime() && (
					<div>
						<ConditionalWrapper
							condition={price?.id}
							wrapper={(children) => (
								<ScTooltip
									text={
										price?.id
											? __(
													'To change the interval, create a new price.',
													'surecart'
											  )
											: null
									}
								>
									{children}
								</ScTooltip>
							)}
						>
							<ScSwitch
								disabled={price?.id}
								checked={price?.recurring_interval === 'never'}
								onScChange={(e) =>
									updatePrice({
										recurring_interval: e.target.checked
											? 'never'
											: 'month',
									})
								}
							>
								{__('Lifetime subscription', 'surecart')}
							</ScSwitch>
						</ConditionalWrapper>
					</div>
				)}

				{product?.recurring && (
					<ScInput
						label={__('Free Trial Days', 'surecart')}
						className="sc-free-trial"
						help={__(
							'If you want to add a free trial, enter the number of days.',
							'surecart'
						)}
						value={price?.trial_duration_days}
						onScChange={(e) =>
							updatePrice({
								trial_duration_days: parseInt(e.target.value),
							})
						}
					>
						<span slot="suffix">{__('Days', 'surecart')}</span>
					</ScInput>
				)}
			</Fragment>
		);
	};

	return (
		<div>
			<Header
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				price={price}
				onArchive={
					product?.recurring
						? () =>
								updatePrice({
									archived: !price.archived,
								})
						: null
				}
				onUnArchive={() =>
					updatePrice({
						archived: false,
					})
				}
				collapsible={collapsible}
				onDelete={product?.recurring ? () => deletePrice() : null}
				css={css`
					.sc-price-copy {
						visibility: hidden;
						opacity: 0;
						transition: opacity var(--sc-transition-fast)
								ease-in-out,
							visibility var(--sc-transition-fast) ease-in-out;
					}
					&:hover {
						.sc-price-copy {
							visibility: visible;
							opacity: 1;
						}
					}
				`}
			/>

			<div
				css={css`
					display: grid;
					gap: var(--sc-form-row-spacing);
					margin-top: 1em;
					height: ${isOpen ? 'auto' : 0};
					overflow: ${isOpen ? 'visible' : 'hidden'};
					visibility: ${isOpen ? 'visibile' : 'hidden'};
				`}
			>
				{product?.recurring ? renderRecurring() : renderOneTime()}
			</div>
		</div>
	);
});
