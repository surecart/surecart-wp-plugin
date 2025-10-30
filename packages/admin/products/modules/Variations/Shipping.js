/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScInput,
	ScMenu,
	ScSwitch,
	ScToggle,
	ScDropdown,
	ScButton,
	ScIcon,
	ScMenuItem,
} from '@surecart/components-react';
import DrawerSection from '../../../ui/DrawerSection';
import useVariantValue from '../../hooks/useVariantValue';
import ResetOverridesDropdown from './ResetOverridesDropdown';

const WEIGHT_UNIT_TYPES = [
	__('lb', 'surecart'),
	__('kg', 'surecart'),
	__('oz', 'surecart'),
	__('g', 'surecart'),
];

export default ({ variant, updateVariant, product }) => {
	const { getValue, isOverridden, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	return (
		<>
			<Global
				styles={css`
					.shipping {
						sc-toggle::part(base) {
							border: none;
						}
						sc-toggle::part(header) {
							padding: 0;
						}
						sc-toggle::part(content) {
							padding: 15px 0 0 0;
						}
					}
				`}
			/>
			<DrawerSection
				className="shipping"
				title={__('Shipping', 'surecart')}
				suffix={
					<ResetOverridesDropdown
						fields={[
							{
								key: 'shipping_enabled',
								label: __('Shipping enabled', 'surecart'),
							},
							{
								key: 'weight',
								label: __('Weight', 'surecart'),
							},
							{
								key: 'weight_unit',
								label: __('Weight unit', 'surecart'),
							},
							{
								key: 'auto_fulfill_enabled',
								label: __('Auto fulfill', 'surecart'),
							},
						]}
						isOverridden={isOverridden}
						onReset={(fieldKey) =>
							updateVariant({ [fieldKey]: null })
						}
					/>
				}
			>
				<ScToggle
					showControl
					open={!!getValue('shipping_enabled')}
					onClick={() => {
						updateVariant(
							getUpdateValue({
								shipping_enabled: true,
							})
						);
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
						value={getValue('weight')}
						onScInput={(e) =>
							updateVariant(
								getUpdateValue({ weight: e.target.value })
							)
						}
					>
						<ScDropdown slot="suffix" placement="bottom-end">
							<ScButton type="text" slot="trigger" circle>
								{getValue('weight_unit')}{' '}
								<ScIcon name="chevron-down" />
							</ScButton>
							<ScMenu>
								{WEIGHT_UNIT_TYPES.map((unit) => (
									<ScMenuItem
										onClick={() => {
											const updates = getUpdateValue({
												weight_unit: unit,
											});
											console.log(
												'Calling updateVariant with:',
												updates
											);
											updateVariant(updates);
										}}
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
					open={!getValue('shipping_enabled')}
					onClick={() => {
						updateVariant(
							getUpdateValue({
								shipping_enabled: false,
							})
						);
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
							checked={getValue('auto_fulfill_enabled')}
							onScChange={(e) => {
								updateVariant(
									getUpdateValue({
										auto_fulfill_enabled: e.target.checked,
									})
								);
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
			</DrawerSection>
		</>
	);
};
