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

	if (!product?.licensing_enabled) {
		return null;
	}

	return (
		<DrawerSection
			title={__('Licensing', 'surecart')}
			suffix={
				<ResetOverridesDropdown
					fields={[
						{
							key: 'license_activation_limit',
							label: __('Activation limit', 'surecart'),
						},
					]}
					isOverridden={isOverridden}
					onReset={(fieldKey) => updateVariant({ [fieldKey]: null })}
				/>
			}
		>
			<ScInput
				type="number"
				label={__('Activation Limit', 'surecart')}
				help={__(
					'Set the default limit for unique activations per license key, applying to all prices. Specify at the price level to override. Leave blank for unlimited activations.',
					'surecart'
				)}
				placeholder={'∞'}
				value={getValue('license_activation_limit')}
				onScInput={(e) => {
					updateVariant(
						getUpdateValue({
							license_activation_limit: e.target.value || null,
						})
					);
				}}
			/>
		</DrawerSection>
	);
};
