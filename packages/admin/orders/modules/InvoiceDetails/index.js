/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import InvoicePageLink from './InvoicePageLink';
import InvoiceStatus from './InvoiceStatus';

export default ({ checkout, loading }) => {
	if (!checkout?.invoice?.id) {
		return null;
	}

	const invoicePageLink = `${scData?.home_url}/wp-admin/admin.php?page=sc-invoices&action=edit&id=${checkout.invoice.id}`;

	return (
		<Box title={__('Invoice Information', 'surecart')} loading={loading}>
			<div>
				<InvoiceStatus status={checkout.invoice.status} />
				<InvoicePageLink invoicePageLink={invoicePageLink} />
			</div>
		</Box>
	);
};
