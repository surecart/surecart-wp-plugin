/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { ScButton } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { addQueryArgs } from '@wordpress/url';

export default ({ customer, loading }) => {
	const renderLoading = () => {
		return <sc-skeleton></sc-skeleton>;
	};

	return (
		<Box
			title={__('Customer', 'surecart')}
			loading={loading}
			footer={
				<div>
					<ScButton
						size="small"
						href={addQueryArgs('admin.php', {
							page: 'sc-customers',
							action: 'edit',
							id: customer?.id,
						})}
					>
						{__('Edit Customer', 'surecart')}
					</ScButton>
				</div>
			}
		>
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				<sc-text
					tag="h3"
					style={{
						'--font-weight': 'var(--sc-font-weight-bold)',
						'--font-size': 'var(--sc-font-size-medium)',
					}}
				>
					{customer?.name}
				</sc-text>
				<div>{customer?.email}</div>
				<div>{customer?.billing_address}</div>
			</div>
		</Box>
	);
};
