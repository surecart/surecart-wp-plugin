/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import CheckoutPageLink from '../components/CheckoutPageLink';
import OrderPageLink from '../components/OrderPageLink';
import ReceiptDownload from '../components/ReceiptDownload';
import Status from '../components/Status';
import InvoiceNumber from '../components/InvoiceNumber';
import DueDate from '../components/DueDate';
import IssueDate from '../components/IssueDate';
import { useInvoice } from '../hooks/useInvoice';

export default () => {
	const { invoice, editInvoice, checkout, loading } = useInvoice();

	const orderPageUrl = checkout?.order?.id
		? `${scData?.home_url}/wp-admin/admin.php?page=sc-orders&action=edit&id=${checkout.order.id}`
		: null;

	return (
		<Box title={__('Invoice Summary', 'surecart')} loading={loading}>
			<div>
				{!!checkout?.order?.number && (
					<InvoiceNumber orderNumber={checkout.order.number} />
				)}

				<Status status={invoice?.status} />

				<IssueDate invoice={invoice} updateInvoice={editInvoice} />

				<DueDate invoice={invoice} updateInvoice={editInvoice} />

				{invoice?.status === 'open' &&
					!!invoice?.checkout_url &&
					!!checkout?.order?.id && (
						<CheckoutPageLink
							checkoutPageUrl={invoice?.checkout_url}
						/>
					)}

				{!!orderPageUrl && (
					<OrderPageLink orderPageUrl={orderPageUrl} />
				)}

				{!!checkout?.pdf_url && (
					<ReceiptDownload pdfUrl={checkout?.pdf_url} />
				)}
			</div>
		</Box>
	);
};
