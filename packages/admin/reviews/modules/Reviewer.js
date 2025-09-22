/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScLineItem } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ review, loading }) => {
	const { customer, customerLoading } = useSelect(
		(select) => {
			const queryArgs = ['surecart', 'customer', review?.customer_id];
			return {
				customer: select(coreStore).getEntityRecord(...queryArgs),
				customerLoading: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[review?.customer_id]
	);

	return (
		<Box
			title={__('Customer', 'surecart')}
			loading={loading || customerLoading}
			footer={
				!loading &&
				customer?.id && (
					<div>
						<ScButton
							size="small"
							href={addQueryArgs('admin.php', {
								page: 'sc-customers',
								action: 'edit',
								id: customer?.id,
							})}
						>
							{__('View Customer', 'surecart')}
						</ScButton>
					</div>
				)
			}
		>
			<div
				css={css`
					display: grid;
					gap: 1em;
				`}
			>
				<ScLineItem>
					<span slot="title">{customer?.name}</span>
					<span slot="description">{customer?.email}</span>
				</ScLineItem>
			</div>
		</Box>
	);
};
