/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { CeButton } from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { useEffect } from 'react';
import useCurrentPage from '../../mixins/useCurrentPage';
import useEntities from '../../mixins/useEntities';
import { addQueryArgs } from '@wordpress/url';

export default () => {
	const { id } = useCurrentPage();
	const { customers, isLoading, pagination, error, fetchCustomers } =
		useEntities('customer');

	useEffect(() => {
		id &&
			fetchCustomers({
				query: {
					order_ids: [id],
					context: 'edit',
				},
			});
	}, [id]);

	const customer = customers?.[0];

	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	return (
		<Box
			title={__('Customer', 'checkout_engine')}
			footer={
				<div>
					<CeButton
						href={addQueryArgs('admin.php', {
							page: 'ce-subscriptions',
							action: 'show',
							id: id,
						})}
					>
						{__('Edit Customer', 'checkout_engine')}
					</CeButton>
				</div>
			}
		>
			{isLoading ? (
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
