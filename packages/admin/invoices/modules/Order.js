/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	ScButton,
	ScInvoiceStatusBadge,
	ScText,
} from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({ invoice, checkout, loading }) => {
	if (!checkout?.order?.id) {
		return null;
	}

	return (
		<>
			<Box title={__('Order', 'surecart')} loading={loading}>
				<div
					css={css`
						display: flex;
						justify-content: space-between;
					`}
				>
					<div
						css={css`
							display: flex;
							align-items: center;
							gap: var(--sc-spacing-small);
						`}
					>
						<ScText>#{checkout?.order?.number}</ScText>
						<ScInvoiceStatusBadge status={invoice?.status} />
					</div>
					<ScButton
						size="small"
						href={`admin.php?page=sc-orders&action=edit&id=${checkout?.order?.id}`}
					>
						{__('View', 'surecart')}
					</ScButton>
				</div>
			</Box>
		</>
	);
};
