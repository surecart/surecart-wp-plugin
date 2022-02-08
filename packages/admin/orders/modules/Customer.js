/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { CeButton } from '@checkout-engine/components-react';
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import useCustomerData from '../hooks/useCustomerData';
import { useEffect } from 'react';
import useCurrentPage from '../../mixins/useCurrentPage';
import useEntities from '../../mixins/useEntities';

export default () => {
	const { id } = useCurrentPage();
	const { data, getEditLink, isLoading, pagination, error, fetchEntities } =
		useEntities('customer');

	useEffect(() => {
		id &&
			fetchEntities({
				query: {
					order_ids: [id],
					context: 'edit',
				},
			});
	}, [id]);

	const customer = data?.[0];

	const renderLoading = () => {
		return <ce-skeleton></ce-skeleton>;
	};

	const editLink = getEditLink(customer?.id);

	return (
		<Box
			title={__('Customer', 'checkout_engine')}
			footer={
				<div>
					{editLink && (
						<CeButton href={editLink}>
							{__('Edit Customer', 'checkout_engine')}
						</CeButton>
					)}
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
