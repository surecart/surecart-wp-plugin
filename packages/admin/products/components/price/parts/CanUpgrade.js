/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ price, updatePrice }) => {
	return (
		<div
			css={css`
				display: grid;
				gap: var(--sc-spacing-medium);
			`}
		>
			<ScSwitch
				checked={price?.portal_subscription_update_enabled}
				onScChange={(e) =>
					updatePrice({
						portal_subscription_update_enabled: e.target.checked,
					})
				}
			>
				{__('Available for upgrade', 'surecart')}
				<span slot="description">
					{__(
						'When turned on, customers can choose this price in the update plans section of the customer dashboard.',
						'surecart'
					)}
				</span>
			</ScSwitch>
		</div>
	);
};
