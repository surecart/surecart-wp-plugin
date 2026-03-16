import { ScInput, ScSelect } from '@surecart/components-react';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import DrawerSection from '../../../ui/DrawerSection';
import useVariantValue from '../../hooks/useVariantValue';
import ResetOverridesDropdown from './ResetOverridesDropdown';

export default ({
	variant,
	updateVariant,
	product,
	downloads,
	downloadsFetching,
	isCustomDownloads,
}) => {
	const { getValue, isOverridden, getUpdateValue } = useVariantValue({
		variant,
		product,
	});

	// Get valid download IDs for this variant to filter inherited values.
	const validDownloadIds = useMemo(
		() =>
			(downloads || [])
				.filter(
					(download) =>
						download?.media?.content_type === 'application/zip'
				)
				.map((download) => download?.id),
		[downloads]
	);

	// Normalize: current_release_download can be a string ID or expanded object.
	const rawReleaseValue = getValue('current_release_download');
	const currentReleaseId = rawReleaseValue?.id ?? rawReleaseValue;

	// If inherited value is not in the variant's downloads, show empty.
	const displayReleaseValue =
		currentReleaseId && validDownloadIds.includes(currentReleaseId)
			? currentReleaseId
			: '';

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
					loading={downloadsFetching}
					value={displayReleaseValue}
					onScChange={(e) => {
						updateVariant(
							getUpdateValue({
								current_release_download:
									e.target.value || null,
							})
						);
					}}
					choices={[
						...(downloads || [])
							// Only .zip files are valid for WP plugin update API releases.
							.filter(
								(download) =>
									download?.media?.content_type ===
									'application/zip'
							)
							.map((download) => ({
								value: download?.id,
								label: download?.media?.filename,
							})),
					]}
				/>
			)}
		</DrawerSection>
	);
};
