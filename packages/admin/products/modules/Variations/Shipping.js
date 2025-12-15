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
	ScRadioGroup,
	ScRadio,
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
					onReset={(fieldKey) => updateVariant({ [fieldKey]: null })}
				/>
			}
		>
			<ScRadioGroup label={__('Product type', 'surecart')} required>
				<div
					css={css`
						display: grid;
						gap: 1em;
						margin-top: 0.5em;
					`}
				>
					<ScRadio
						checked={getValue('shipping_enabled')}
						value="true"
						onClick={() =>
							updateVariant(
								getUpdateValue({
									shipping_enabled: true,
								})
							)
						}
					>
						{__('Physical product', 'surecart')}
						<span
							slot="description"
							css={css`
								margin: 0.5em 0px 0px 0px; // fix style conflicts on product page.
							`}
						>
							{__(
								'Customers will enter shipping details at checkout.',
								'surecart'
							)}
						</span>
					</ScRadio>
					<ScRadio
						checked={!getValue('shipping_enabled')}
						value="false"
						onClick={() =>
							updateVariant(
								getUpdateValue({
									shipping_enabled: false,
								})
							)
						}
					>
						{__('Digital product or service', 'surecart')}
						<span
							slot="description"
							css={css`
								margin: 0.5em 0px 0px 0px; // fix style conflicts on product page.
							`}
						>
							{__(
								'Customers won’t enter shipping details at checkout.',
								'surecart'
							)}
						</span>
					</ScRadio>
				</div>
			</ScRadioGroup>

			{getValue('shipping_enabled') && (
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
									onClick={() =>
										updateVariant(
											getUpdateValue({
												...variant,
												weight_unit: unit,
											})
										)
									}
									checked={getValue('weight_unit') === unit}
									key={unit}
								>
									{unit}
								</ScMenuItem>
							))}
						</ScMenu>
					</ScDropdown>
				</ScInput>
			)}

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
		</DrawerSection>
	);
};
