import { ScInput, ScSelect, ScSwitch } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import DrawerSection from '../../../ui/DrawerSection';
import useVariantValue from '../../hooks/useVariantValue';
import ResetOverridesDropdown from './ResetOverridesDropdown';

export default ({ variant, updateVariant, product }) => {
	const { getValue, isOverridden, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	// Check if custom downloads is enabled
	const downloadsEnabled = getValue('downloads_enabled');

	// Fetch downloads for current release selection (only when custom downloads enabled)
	const { downloads, fetching } = useSelect(
		(select) => {
			// Reset/refetch when variant changes
			if (!variant?.id) {
				return {
					downloads: [],
					fetching: false,
				};
			}

			// Only fetch when custom downloads mode is enabled
			if (downloadsEnabled !== true) {
				return {
					downloads: [],
					fetching: false,
				};
			}

			const queryArgs = [
				'surecart',
				'download',
				{
					context: 'edit',
					variant_ids: [variant?.id],
					per_page: 100,
					expand: ['media', 'variant'],
				},
			];
			return {
				downloads: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[variant?.id, downloadsEnabled]
	);

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
						{
							key: 'current_release_download',
							label: __('Current release', 'surecart'),
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
			{downloadsEnabled === true && (
				<ScSelect
					label={__('Current Release', 'surecart')}
					help={__(
						'This is the current release zip of your software.',
						'surecart'
					)}
					loading={fetching}
					value={getValue('current_release_download')}
					onScChange={(e) => {
						updateVariant(
							getUpdateValue({
								current_release_download: e.target.value || null,
							})
						);
					}}
					choices={(downloads || [])
						.filter(
							(download) =>
								download?.media?.content_type === 'application/zip'
						)
						.map((download) => {
							return {
								value: download?.id,
								label: download?.media?.filename,
							};
						})}
				/>
			)}
		</DrawerSection>
	);
};
