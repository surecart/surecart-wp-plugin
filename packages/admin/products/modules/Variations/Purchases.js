import { ScInput, ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import DrawerSection from '../../../ui/DrawerSection';
import useVariantValue from '../../hooks/useVariantValue';
import ResetOverridesDropdown from './ResetOverridesDropdown';

export default ({ variant, updateVariant, product }) => {
	const { getValue, isOverridden, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	return (
		<DrawerSection
			title={__('Purchases', 'surecart')}
			suffix={
				<ResetOverridesDropdown
					fields={[
						{
							key: 'purchase_limit',
							label: __('Purchase limit', 'surecart'),
						},
					]}
					isOverridden={isOverridden}
					onReset={(fieldKey) => updateVariant({ [fieldKey]: null })}
				/>
			}
		>
			<ScSwitch
				checked={parseInt(getValue('purchase_limit')) > 0}
				onScChange={(e) => {
					updateVariant(
						getUpdateValue({
							purchase_limit: e.target.checked
								? product?.purchase_limit || 1
								: 0,
						})
					);
				}}
			>
				{__('Limit per-customer purchases', 'surecart')}
				<span slot="description">
					{__(
						'Limit the number of times a single customer can purchase this variant.',
						'surecart'
					)}
				</span>
			</ScSwitch>
			{!!getValue('purchase_limit') && (
				<ScInput
					label={__('Purchase limit', 'surecart')}
					type="number"
					value={getValue('purchase_limit')}
					onScInput={(e) => {
						updateVariant(
							getUpdateValue({
								purchase_limit: e.target.value || null,
							})
						);
					}}
				/>
			)}
		</DrawerSection>
	);
};
