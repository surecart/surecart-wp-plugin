/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	ScButton,
	ScDropdown,
	ScIcon,
	ScInput,
	ScMenu,
	ScMenuItem,
	ScSwitch,
	ScToggle,
} from '@surecart/components-react';
import { useState } from 'react';

const WEIGHT_UNIT_TYPES = [
	__('lb', 'surecart'),
	__('kg', 'surecart'),
	__('oz', 'surecart'),
	__('g', 'surecart'),
];

export default ({ loading, product, updateProduct }) => {
	return (
		<Box loading={loading} title={__('Shipping', 'surecart')}>
			<ScToggle
				showControl
				open={!!product?.shipping_enabled}
				onClick={() => {
					updateProduct({
						shipping_enabled: true,
					});
				}}
			>
				<span
					slot="summary"
					css={css`
						font-weight: var(--sc-input-label-font-weight);
					`}
				>
					{__('Physical product', 'surecart')}
				</span>

				<ScInput
					label={__('Shipping Weight', 'surecart')}
					value={product?.weight}
					onScInput={(e) => updateProduct({ weight: e.target.value })}
				>
					<ScDropdown slot="suffix" placement="bottom-end">
						<ScButton type="text" slot="trigger" circle>
							{product?.weight_unit}{' '}
							<ScIcon name="chevron-down" />
						</ScButton>
						<ScMenu>
							{WEIGHT_UNIT_TYPES.map((unit) => (
								<ScMenuItem
									onClick={() =>
										updateProduct({ weight_unit: unit })
									}
									key={unit}
								>
									{unit}
								</ScMenuItem>
							))}
						</ScMenu>
					</ScDropdown>
				</ScInput>
			</ScToggle>

			<ScToggle
				showControl
				open={!product?.shipping_enabled}
				onClick={() => {
					updateProduct({
						shipping_enabled: false,
					});
				}}
			>
				<span
					slot="summary"
					css={css`
						font-weight: var(--sc-input-label-font-weight);
					`}
				>
					{__('Digital product or service', 'surecart')}
				</span>
				<div
					css={css`
						display: grid;
						gap: var(--sc-spacing-large);
					`}
				>
					<div
						css={css`
							color: var(--sc-input-help-text-color);
							font-size: var(
								--sc-input-help-text-font-size-medium
							);
						`}
					>
						{__(
							'Customers won’t enter shipping details at checkout.',
							'surecart'
						)}
					</div>

					<ScSwitch
						checked={product?.auto_fulfill}
						onScChange={(e) => {
							updateProduct({
								auto_fulfill: e.target.checked,
							});
						}}
					>
						{__('Auto Fulfill', 'surecart')}
						<span slot="description">
							{__(
								'Turn this off if you do not wish to automatically fulfill this product when an order is placed.',
								'surecart'
							)}
						</span>
					</ScSwitch>
				</div>
			</ScToggle>
		</Box>
	);
};
