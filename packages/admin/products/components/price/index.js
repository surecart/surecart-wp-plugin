/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

import { ScInput, ScPriceInput, ScSwitch } from '@surecart/components-react';
import Header from './Header';

// hocs
import { translateInterval } from '../../../util/translations';
import useEntity from '../../../hooks/useEntity';

export default ({ id, prices, product }) => {
	// are the price details open?
	const [isOpen, setIsOpen] = useState(true);

	// use the price entity.
	const {
		price,
		editPrice,
		deletePrice,
		savePrice,
		savingPrice,
		deletingPrice,
	} = useEntity('price', id);

	// toggle the archive.
	const toggleArchive = async (archived) => {
		try {
			await savePrice({ archived }, { throwOnError: true });
		} catch (e) {
			console.error(e);
		}
	};

	// get the price type.
	const getPriceType = () => {
		if (price?.recurring_interval) {
			if (price?.recurring_period_count) {
				return 'multiple';
			}
			return 'subscription';
		}
		return 'once';
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
				onArchive={() => toggleArchive(!price?.archived)}
				onDelete={() => deletePrice(price)}
				collapsible={prices?.length > 1}
			/>

			<div
				css={css`
					gap: var(--sc-form-row-spacing);
					display: ${isOpen ? 'grid' : 'none'};
				`}
			>
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
							editPrice({ amount: e.target.value });
						}}
						required
					>
						<span slot="suffix" style={{ opacity: '0.5' }}>
							{translateInterval(
								price?.recurring_interval_count,
								price?.recurring_interval,
								'every',
								''
							)}
							{price?.recurring_period_count &&
								translateInterval(
									price?.recurring_period_count,
									price?.recurring_interval,
									' for',
									''
								)}
						</span>
					</ScPriceInput>
				</sc-flex>
				<div>
					<ScSwitch
						checked={price?.ad_hoc}
						onScChange={(e) =>
							editPrice({ ad_hoc: e.target.checked })
						}
					>
						{__(
							'Allow customers to pay what they want',
							'surecart'
						)}
					</ScSwitch>
				</div>
				{!!price?.ad_hoc && (
					<div
						css={css`
							display: flex;
							gap: var(--sc-form-row-spacing);
							> * {
								flex: 1;
							}
						`}
					>
						<ScPriceInput
							label={__('Minimum Amount', 'surecart')}
							className="sc-ad-hoc-min-amount"
							currencyCode={scData.currency_code}
							value={price?.ad_hoc_min_amount}
							onScChange={(e) =>
								editPrice({
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
								editPrice({
									ad_hoc_max_amount: e.target.value,
								})
							}
						/>
					</div>
				)}

				{getPriceType() === 'subscription' && (
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
							editPrice({
								trial_duration_days: parseInt(e.target.value),
							})
						}
					>
						<span slot="suffix">{__('Days', 'surecart')}</span>
					</ScInput>
				)}

				{getPriceType() === 'multiple' && (
					<ScInput
						label={__('Number of Payments', 'surecart')}
						className="sc-payment-number"
						required
						type="number"
						min={1}
						value={price?.recurring_period_count}
						onScChange={(e) =>
							editPrice({
								recurring_period_count: parseInt(
									e.target.value
								),
							})
						}
					>
						<span slot="suffix">{__('Payments', 'surecart')}</span>
					</ScInput>
				)}

				{product?.tax_enabled && scData?.tax_protocol?.tax_enabled && (
					<ScSwitch
						style={{
							marginTop: '0.5em',
							display: 'inline-block',
						}}
						checked={price?.tax_behavior === 'inclusive'}
						onScChange={() =>
							editPrice({
								tax_behavior:
									price?.tax_behavior === 'inclusive'
										? 'exclusive'
										: 'inclusive',
							})
						}
					>
						{__('Tax is included', 'surecart')}
					</ScSwitch>
				)}
			</div>

			{(savingPrice || deletingPrice) && (
				<sc-block-ui spinner></sc-block-ui>
			)}
		</div>
	);
};
