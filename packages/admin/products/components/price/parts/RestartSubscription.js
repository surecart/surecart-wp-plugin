/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ price, updatePrice }) => {
	return price?.recurring_period_count ? (
		<div
			css={css`
				> *:not(:last-child) {
					margin-bottom: var(--sc-spacing-medium);
				}
			`}
		>
			<ScSwitch
				checked={price?.restart_subscription_on_completed}
				onScChange={(e) =>
					updatePrice({
						restart_subscription_on_completed: e?.target?.checked,
					})
				}
			>
				{__('Restart subscription when completed', 'surecart')}
				<span slot="description">
					{__(
						'Automatically restart the subscription after all installment payments are completed.',
						'surecart'
					)}
				</span>
			</ScSwitch>
		</div>
	) : null;
};