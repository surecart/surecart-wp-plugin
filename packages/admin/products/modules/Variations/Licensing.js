import { ScInput, ScSelect, ScSwitch } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import DrawerSection from '../../../ui/DrawerSection';
import useVariantDownloads from '../../hooks/useVariantDownloads';
import useVariantValue from '../../hooks/useVariantValue';
import ResetOverridesDropdown from './ResetOverridesDropdown';

export default ({ variant, updateVariant, product }) => {
	const { getValue, isOverridden, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	// Check if custom downloads is enabled
	const downloadsEnabled = getValue('downloads_enabled');
	const isCustomDownloads = downloadsEnabled === true;

	// Fetch downloads for current release selection (only when custom downloads enabled)
	const { downloads, fetching } = useVariantDownloads({
		variant,
		isCustomDownloads,
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
						...(isCustomDownloads
							? [
									{
										key: 'current_release_download',
										label: __(
											'Current release',
											'surecart'
										),
									},
							  ]
							: []),
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
			{isCustomDownloads && (
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
								current_release_download:
									e.target.value || null,
							})
						);
					}}
					choices={(downloads || [])
						.filter(
							(download) =>
								download?.media?.content_type ===
								'application/zip'
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
