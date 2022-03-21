/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { CeButton } from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { addQueryArgs } from '@wordpress/url';

export default ({ customer, loading }) => {
	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	return (
		<Box
			title={__('Customer', 'surecart')}
			footer={
				<div>
					<CeButton
						href={addQueryArgs('admin.php', {
							page: 'ce-customers',
							action: 'edit',
							id: customer?.id,
						})}
					>
						{__('Edit Customer', 'surecart')}
					</CeButton>
				</div>
			}
		>
			{loading ? (
				renderLoading()
			) : (
				<div
					css={css`
						display: grid;
						gap: 0.5em;
					`}
				>
					<ce-text
						tag="h3"
						style={{
							'--font-weight': 'var(--ce-font-weight-bold)',
							'--font-size': 'var(--ce-font-size-medium)',
						}}
					>
						{customer?.name}
					</ce-text>
					<div>{customer?.email}</div>
					<div>{customer?.billing_address}</div>
				</div>
			)}
		</Box>
	);
};
