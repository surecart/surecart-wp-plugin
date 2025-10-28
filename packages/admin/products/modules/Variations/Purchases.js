import { ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import DrawerSection from '../../../ui/DrawerSection';
import useVariantValue from '../../hooks/useVariantValue';
import ResetOverridesDropdown from './ResetOverridesDropdown';

export default ({ variant, updateVariant, product }) => {
	const { getValue, isOverridden } = useVariantValue({ variant, product });

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
				checked={!!getValue('purchase_limit')}
				onScChange={(e) => {
					updateVariant({
						purchase_limit: e.target.checked ? 1 : null,
					});
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
		</DrawerSection>
	);
};
