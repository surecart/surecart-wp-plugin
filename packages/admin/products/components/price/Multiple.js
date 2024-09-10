/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScInput, ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import SetupFee from './parts/SetupFee';

import AdHoc from './parts/AdHoc';
import Amount from './parts/Amount';
import ScratchAmount from './parts/ScratchAmount';
import Trial from './parts/Trial';
import LicenseActivationLimit from './parts/LicenseActivationLimit';

export default ({ price, updatePrice, product }) => {
	return (
		<>
			<Amount price={price} updatePrice={updatePrice} />
			{!price?.id && (
				<>
					<ScInput
						label={__('Number of Payments', 'surecart')}
						className="sc-payment-number"
						required
						css={css`
							flex: 1 1 50%;
						`}
						type="number"
						min={1}
						value={price?.recurring_period_count}
						onScInput={(e) =>
							updatePrice({
								recurring_period_count: parseInt(
									e.target.value
								),
							})
						}
					>
						<span slot="suffix">{__('Payments', 'surecart')}</span>
					</ScInput>
					{!!price?.recurring_period_count && (
						<ScSwitch
							checked={price?.revoke_purchases_on_completed}
							onScChange={(e) =>
								updatePrice({
									revoke_purchases_on_completed:
										e?.target?.checked,
								})
							}
						>
							{__(
								'Revoke access when installments are completed',
								'surecart'
							)}
							<span slot="description">
								{__(
									'Automatically revoke access to integrations and licenses after all payments are completed.',
									'surecart'
								)}
							</span>
						</ScSwitch>
					)}
				</>
			)}
			<ScratchAmount price={price} updatePrice={updatePrice} />
			<AdHoc price={price} updatePrice={updatePrice} />
			<SetupFee price={price} updatePrice={updatePrice} />
			<Trial price={price} updatePrice={updatePrice} />
			<LicenseActivationLimit
				price={price}
				updatePrice={updatePrice}
				product={product}
			/>
		</>
	);
};
