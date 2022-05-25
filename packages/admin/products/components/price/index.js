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
import useEntity from '../../../mixins/useEntity';
import ConditionalWrapper from '../../../components/ConditionalWrapper';

export default ({ price: priceEntity, prices, product, index }) => {
	const { price, updatePrice, deletePrice, priceErrors } = useEntity(
		'price',
		priceEntity?.id,
		index
	);

	const [isOpen, setIsOpen] = useState(true);

	// if invalid, toggle open.
	useEffect(() => {
		if (priceErrors?.length) {
			setIsOpen(true);
		}
	}, [priceErrors]);

	const collapsible = prices?.length > 1;

	const renderTaxInput = () => {
		if (!product?.tax_enabled || !scData?.tax_protocol?.tax_enabled)
			return null;
		return (
			<ScSwitch
				style={{ marginTop: '0.5em', display: 'inline-block' }}
				checked={price?.tax_behavior === 'inclusive'}
				onScChange={() =>
					updatePrice({
						tax_behavior:
							price?.tax_behavior === 'inclusive'
								? 'exclusive'
								: 'inclusive',
					})
				}
			>
				{__('Tax is included', 'surecart')}
			</ScSwitch>
		);
	};

	const renderRecurringIntervals = () => {
		return (
			<sc-flex>
				<ScPriceInput
					css={css`
						flex: 1 1 75%;
					`}
					label={__('Price', 'surecart')}
					className="sc-price-amount"
					currencyCode={scData.currency_code}
					value={price?.amount}
					name="price"
					onScChange={(e) => {
						updatePrice({ amount: e.target.value });
					}}
					required
				/>
				<ConditionalWrapper
					condition={!!price?.id}
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
						required
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
								css={css`
									min-width: 125px;
								`}
								onScChange={(e) =>
									updatePrice({
										recurring_interval: e.target.value,
									})
								}
								choices={[
									{
										value: 'day',
										label: __('Day', 'surecart'),
									},
									{
										value: 'week',
										label: __('Week', 'surecart'),
									},
									{
										value: 'month',
										label: __('Month', 'surecart'),
									},
									{
										value: 'year',
										label: __('Year', 'surecart'),
									},
								]}
							/>
						</div>
					</ScFormControl>
				</ConditionalWrapper>
			</sc-flex>
		);
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
							currencyCode={scData.currency_code}
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
							currencyCode={scData.currency_code}
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
				{renderRecurringIntervals()}
				<ScInput
					label={__('Free Trial Days', 'surecart')}
					className="sc-free-trial"
					help={__(
						'If you want to add a free trial, enter the number of days.',
						'surecart'
					)}
					type="number"
					min={1}
					max={365}
					value={price?.trial_duration_days}
					onScChange={(e) =>
						updatePrice({
							trial_duration_days: parseInt(e.target.value),
						})
					}
				>
					<span slot="suffix">{__('Days', 'surecart')}</span>
				</ScInput>
			</Fragment>
		);
	};

	const renderMultiple = () => {
		return (
			<Fragment>
				{renderRecurringIntervals()}
				<ScInput
					label={__('Number of Payments', 'surecart')}
					className="sc-payment-number"
					required
					type="number"
					min={1}
					value={price?.recurring_period_count}
					onScChange={(e) =>
						updatePrice({
							recurring_period_count: parseInt(e.target.value),
						})
					}
				>
					<span slot="suffix">{__('Payments', 'surecart')}</span>
				</ScInput>
			</Fragment>
		);
	};

	const getPriceType = () => {
		if (price?.recurring_interval) {
			if (price?.recurring_period_count) {
				return 'multiple';
			}
			return 'subscription';
		}
		return 'once';
	};

	const renderPriceInputs = () => {
		const type = getPriceType();
		if (type === 'subscription') {
			return renderRecurring();
		}
		if (type === 'multiple') {
			return renderMultiple();
		}
		return renderOneTime();
	};

	return (
		<div
			css={css`
				padding: var(--sc-spacing-large);
				border: 1px solid var(--sc-color-gray-300);
				border-radius: var(--sc-border-radius-medium);
				box-shadow: var(--sc-shadow-small);
				display: grid;
				gap: 1em;
			`}
		>
			<Header
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				price={price}
				onArchive={() =>
					updatePrice({
						archived: !price.archived,
					})
				}
				onUnArchive={() =>
					updatePrice({
						archived: false,
					})
				}
				collapsible={collapsible}
				onDelete={!price?.id ? () => deletePrice() : null}
			/>

			<div
				css={css`
					gap: var(--sc-form-row-spacing);
					display: ${isOpen ? 'grid' : 'none'};
				`}
			>
				<ScSelect
					label={__('Payment Type', 'surecart')}
					required
					value={getPriceType()}
					onScChange={(e) => {
						const type = e.target.value;
						switch (type) {
							case 'subscription':
								updatePrice({
									recurring_interval: 'month',
									recurring_interval_count: 1,
									recurring_period_count: null,
									recurring_end_behavior: 'cancel',
								});
								break;
							case 'multiple':
								updatePrice({
									recurring_interval: 'month',
									recurring_interval_count: 1,
									recurring_period_count: 3,
									recurring_end_behavior: 'complete',
								});
								break;
							case 'once':
								updatePrice({
									recurring_interval: null,
									recurring_interval_count: null,
									recurring_period_count: null,
									recurring_end_behavior: null,
								});
								break;
						}
					}}
					choices={[
						{
							value: 'once',
							label: __('One-time Payment', 'surecart'),
						},
						{
							value: 'multiple',
							label: __('Multiple Payments', 'surecart'),
						},
						{
							value: 'subscription',
							label: __('Subscription', 'surecart'),
						},
					]}
				></ScSelect>

				{renderPriceInputs()}

				{renderTaxInput()}
			</div>
		</div>
	);
};
