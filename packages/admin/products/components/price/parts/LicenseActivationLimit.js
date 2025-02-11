/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScDivider, ScInput, ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

export default ({ price, updatePrice, className, product }) => {
	const [showLicenseActivationLimit, setShowLicenseActivationLimit] =
		useState(() => !!price?.license_activation_limit);

	if (!product?.licensing_enabled) {
		return null;
	}

	return (
		<>
			<ScDivider />
			<div
				css={css`
					display: grid;
					gap: var(--sc-spacing-medium);
				`}
			>
				<ScSwitch
					checked={showLicenseActivationLimit}
					onScChange={(e) => {
						setShowLicenseActivationLimit(e.target.checked);
						updatePrice({
							license_activation_limit: e.target.checked
								? product?.license_activation_limit
								: null,
						});
					}}
				>
					{__('Custom license activation limit', 'surecart')}
					<span slot="description">
						{__(
							'The maximum number of unique activations allowed per license key for this price.',
							'surecart'
						)}
					</span>
				</ScSwitch>

				{showLicenseActivationLimit && (
					<ScInput
						className={className}
						type="number"
						label={__('License activation limit', 'surecart')}
						help={__(
							'Specify the maximum number of unique activations allowed per license key for this pricing option. If left blank, the default limit set for the product will apply.',
							'surecart'
						)}
						placeholder={product?.license_activation_limit || '∞'}
						value={price?.license_activation_limit}
						onScInput={(e) => {
							updatePrice({
								license_activation_limit:
									e.target.value || null,
							});
						}}
					/>
				)}
			</div>
		</>
	);
};
