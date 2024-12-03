/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

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

	const invoicePageLink = addQueryArgs('admin.php', {
		page: 'sc-invoices',
		action: 'edit',
		id: checkout.invoice.id,
   });

	return (
		<Box title={__('Invoice', 'surecart')} loading={loading}>
			<div>
				<InvoiceStatus status={checkout.invoice.status} />
				<InvoicePageLink invoicePageLink={invoicePageLink} />
			</div>
		</Box>
	);
};
