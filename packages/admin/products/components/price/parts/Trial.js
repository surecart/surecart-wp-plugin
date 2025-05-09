/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScInput, ScSwitch, ScPremiumTag } from '@surecart/components-react';

export default ({ className, price, updatePrice }) => {
	return (
		<>
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-medium);
				`}
			>
				<ScSwitch
					checked={!!price?.trial_duration_days}
					onScChange={(e) =>
						updatePrice({
							trial_duration_days: e.target.checked ? 15 : null,
						})
					}
				>
					{__('Trial', 'surecart')}
					{!scData?.entitlements?.subscription_trials && (
						<>
							{' '}
							<ScPremiumTag />
						</>
					)}

					<span slot="description">
						{__(
							'Offer a trial period before charging the first payment.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{!!price?.trial_duration_days && (
					<ScInput
						label={__('Trial Days', 'surecart')}
						className={className}
						type="number"
						min={1}
						max={365}
						value={price?.trial_duration_days || 1}
						onScInput={(e) =>
							e.target.value &&
							updatePrice({
								trial_duration_days: parseInt(e.target.value),
							})
						}
					>
						<span slot="suffix">{__('Days', 'surecart')}</span>
					</ScInput>
				)}

				{!!price?.trial_duration_days &&
					!!price?.setup_fee_enabled &&
					price?.setup_fee_amount >= 0 && (
						<ScSwitch
							checked={price.setup_fee_trial_enabled === false}
							onScChange={(e) =>
								updatePrice({
									setup_fee_trial_enabled: !e.target.checked,
								})
							}
						>
							{__('Paid trial', 'surecart')}
							<span slot="description">
								{__(
									'Charge the setup fee during the free trial period.',
									'surecart'
								)}
							</span>
						</ScSwitch>
					)}
			</div>
		</>
	);
};
