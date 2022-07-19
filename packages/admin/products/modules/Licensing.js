/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScInput, ScSwitch } from '@surecart/components-react';

import Box from '../../ui/Box';

export default ({ loading, product, updateProduct }) => {
	if (!scData?.entitlements?.licensing) {
		return null;
	}

	return (
		<Box
			loading={loading}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Licensing', 'surecart')}
				</div>
			}
		>
			<ScSwitch
				checked={product?.licensing_enabled}
				onScChange={(e) =>
					updateProduct({
						licensing_enabled: !!e.target.checked,
					})
				}
			>
				{__('Enable license creation', 'surecart')}
			</ScSwitch>

			{!!product?.licensing_enabled && (
				<ScInput
					type="number"
					label={__('Activation Limit', 'surecart')}
					help={__(
						'Enter the number of unique activations per license key. Leave blank for inifinite.',
						'surecart'
					)}
					onScUpdate={(e) => {
						updateProduct({
							license_activation_limit: e.target.value || null,
						});
					}}
				/>
			)}
		</Box>
	);
};
