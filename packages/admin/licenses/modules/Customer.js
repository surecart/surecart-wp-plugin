/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScText } from '@surecart/components-react';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import Box from '../../ui/Box';

export default ({ licenseId }) => {
	const { customer, loading, loadingError } = useSelect(
		(select) => {
			const queryArgs = [
				'surecart',
				'customer',
				{
					context: 'edit',
					license_ids: [licenseId],
					expand: ['product'],
					per_page: 100,
				},
			];
			return {
				customer: select(coreStore).getEntityRecords(...queryArgs)?.[0],
				loading: select(coreStore).isResolving(
					'getEntityRecords',
					queryArgs
				),
				loadingError: select(coreStore)?.getResolutionError?.(
					'getEntityRecords',
					queryArgs
				),
			};
		},
		[licenseId]
	);

	return (
		<Box
			title={__('Customer', 'surecart')}
			loading={loading}
			footer={
				!loading && (
					<div>
						<ScButton
							href={addQueryArgs('admin.php', {
								page: 'sc-customers',
								action: 'edit',
								id: customer?.id,
							})}
						>
							{__('Edit Customer', 'surecart')}
						</ScButton>
					</div>
				)
			}
		>
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				<ScText
					tag="h3"
					style={{
						'--font-weight': 'var(--sc-font-weight-bold)',
						'--font-size': 'var(--sc-font-size-medium)',
					}}
				>
					{customer?.name}
				</ScText>
				<div>{customer?.email}</div>
				<div>{customer?.billing_address}</div>
			</div>
		</Box>
	);
};
