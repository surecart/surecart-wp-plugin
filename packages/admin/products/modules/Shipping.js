/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../../ui/Box';
import { __ } from '@wordpress/i18n';
import {
	ScAlert,
	ScButton,
	ScCard,
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
	const renderShippingSettings = () => {
		return (
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
				<ScCard
					borderless
					noPadding
					onClick={(e) => e.stopPropagation()}
				>
					<ScInput
						label={__('Shipping Weight', 'surecart')}
						value={product?.weight}
						onScInput={(e) =>
							updateProduct({ weight: e.target.value })
						}
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
				</ScCard>
			</ScToggle>
		);
	};

	return (
		<Box loading={loading} title={__('Shipping', 'surecart')}>
			{renderShippingSettings()}
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
				<ScCard borderless noPadding>
					<ScAlert type="info" open>
						{__(
							'Shipping details will not be collected for this product',
							'surecart'
						)}
					</ScAlert>
				</ScCard>
			</ScToggle>
		</Box>
	);
};
