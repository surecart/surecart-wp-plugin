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
	ScToggle,
} from '@surecart/components-react';

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
				summary={__('Physical product', 'surecart')}
			>
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
				summary={__('Digital product or service', 'surecart')}
			>
				<div
					css={css`
						color: var(--sc-input-help-text-color);
						font-size: var(--sc-input-help-text-font-size-medium);
					`}
				>
					{__(
						'Customers won’t enter shipping details at checkout.',
						'surecart'
					)}
				</div>
			</ScToggle>
		</Box>
	);
};
