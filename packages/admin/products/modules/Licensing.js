/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScInput, ScSelect, ScSwitch } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';

export default ({ loading, id, product, updateProduct }) => {
	if (!scData?.entitlements?.licensing) {
		return null;
	}

	const { downloads, fetching } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'download',
				{ context: 'edit', product_ids: [id], per_page: 100 },
			];
			return {
				downloads: select(coreStore).getEntityRecords(...queryArgs),
				fetching: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[id]
	);

	return (
		<Box
			loading={loading}
			title={
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: space-between;
					`}
				>
					{__('Licensing', 'surecart')}
				</div>
			}
		>
			<ScSwitch
				checked={product?.licensing_enabled}
				onScChange={(e) =>
					updateProduct({
						licensing_enabled: !!e.target.checked,
					})
				}
			>
				{__('Enable license creation', 'surecart')}
			</ScSwitch>

			{!!product?.licensing_enabled && (
				<>
					<ScInput
						type="number"
						label={__('Activation Limit', 'surecart')}
						help={__(
							'Enter the number of unique activations per license key. Leave blank for infinite.',
							'surecart'
						)}
						onScInput={(e) => {
							updateProduct({
								license_activation_limit:
									e.target.value || null,
							});
						}}
					/>
					<ScSelect
						label={__('Current Release', 'surecart')}
						loading={fetching}
						value={product?.current_release_download}
						onScChange={(e) => {
							updateProduct({
								current_release_download: e.target.value,
							});
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
				</>
			)}
		</Box>
	);
};
