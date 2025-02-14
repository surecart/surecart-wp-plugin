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
				checked={price?.revoke_purchases_on_completed}
				onScChange={(e) =>
					updatePrice({
						revoke_purchases_on_completed: e?.target?.checked,
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
		</div>
	) : null;
};
