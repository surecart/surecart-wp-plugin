/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import {
	ScUpgradeRequired,
	ScInput,
	ScSwitch,
	ScPremiumTag,
} from '@surecart/components-react';

export default ({ className, price, updatePrice }) => {
	return (
		<ScUpgradeRequired
			required={!scData?.entitlements?.subscription_trials}
			css={css`
				display: grid;
				gap: var(--sc-spacing-small);
			`}
		>
			<ScSwitch
				checked={!!price.trial_duration_days}
				onScChange={(e) =>
					updatePrice({
						trial_duration_days: e.target.checked ? 15 : null,
					})
				}
			>
				{__('Free Trial', 'surecart')}
				{!scData?.entitlements?.subscription_trials && (
					<>
						{' '}
						<ScPremiumTag />
					</>
				)}
			</ScSwitch>

			{!!price?.trial_duration_days && (
				<>
					<ScInput
						label={__('Free Trial Days', 'surecart')}
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

					{!!price?.setup_fee_enabled && (
						<ScSwitch
							checked={!price.setup_fee_trial_enabled}
							onScChange={(e) =>
								updatePrice({
									setup_fee_trial_enabled: !e.target.checked,
								})
							}
						>
							{__(
								'Charge setup fee during free trial',
								'surecart'
							)}
						</ScSwitch>
					)}
				</>
			)}
		</ScUpgradeRequired>
	);
};
