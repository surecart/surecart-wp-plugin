import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import DataTable from '../../../components/DataTable';
import { store } from '@checkout-engine/data';
import { addQueryArgs } from '@wordpress/url';
import { CeInvoiceStatusBadge } from '@checkout-engine/components-react';

export default ({ invoice }) => {
	const getCustomer = (invoice) => {
		const customer = select(store).selectRelation(
			'invoice',
			invoice.id,
			'customer'
		);
		return customer?.name || customer?.email;
	};

	return (
		<div>
			<DataTable
				title={__('Invoices', 'checkout_engine')}
				columns={{
					amount: {
						label: __('Amount', 'checkout_engine'),
					},
					status: {
						label: __('Status', 'checkout_engine'),
					},
					number: {
						label: __('Invoice Number', 'checkout_engine'),
					},
					customer: {
						label: __('Customer', 'checkout_engine'),
					},
					actions: {
						width: '100px',
					},
				}}
				items={[
					{
						amount: (
							<ce-format-number
								type="currency"
								currency={invoice?.currency}
								value={invoice?.amount_due}
							></ce-format-number>
						),
						status: (
							<CeInvoiceStatusBadge
								invoice={invoice}
							></CeInvoiceStatusBadge>
						),
						number: invoice.number,
						customer: getCustomer(invoice),
						actions: (
							<ce-button
								size="small"
								href={addQueryArgs('admin.php', {
									page: 'ce-invoices',
									action: 'edit',
									id: invoice?.id,
								})}
							>
								View
							</ce-button>
						),
					},
				]}
			/>
		</div>
	);
};
