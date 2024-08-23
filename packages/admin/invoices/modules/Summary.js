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

export default ({ invoice, updateInvoice, checkout, loading }) => {
	const checkoutPageUrl =
		invoice?.checkout?.id && invoice?.status !== 'paid'
			? `${window.scData?.checkout_page_url}?checkout_id=${invoice?.checkout?.id}`
			: null;

	const orderPdfUrl = checkout?.order?.pdf_url;
	const orderPageUrl = checkout?.order?.id
		? `${scData?.home_url}/wp-admin/admin.php?page=sc-orders&action=edit&id=${checkout?.order?.id}`
		: null;

	return (
		<>
			<Box title={__('Invoice Summary', 'surecart')} loading={loading}>
				<div>
					{!!checkout?.order?.number && (
						<InvoiceNumber orderNumber={checkout.order.number} />
					)}

					<Status status={invoice?.status} />

					<DueDate invoice={invoice} updateInvoice={updateInvoice} />

					<IssueDate
						invoice={invoice}
						updateInvoice={updateInvoice}
					/>

					{!!checkoutPageUrl && (
						<CheckoutPageLink checkoutPageUrl={checkoutPageUrl} />
					)}

					{!!orderPageUrl && (
						<OrderPageLink orderPageUrl={orderPageUrl} />
					)}

					{!!orderPdfUrl && (
						<ReceiptDownload orderPdfUrl={orderPdfUrl} />
					)}
				</div>
			</Box>
		</>
	);
};
