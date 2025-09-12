/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScButton, ScLineItem } from '@surecart/components-react';
import Box from '../../ui/Box';
import { addQueryArgs } from '@wordpress/url';

export default ({ customer, loading }) => {
	return (
		<Box
			title={__('Customer', 'surecart')}
			loading={loading}
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
