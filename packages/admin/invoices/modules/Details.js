/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import { ScFormatDate } from '@surecart/components-react';

export default ({ invoice, checkout, loading, busy, setBusy }) => {
	const isDraftInvoice = invoice?.status === 'draft';

	return (
		<>
			<Box title={__('', 'surecart')} loading={loading || busy}>
				<Definition title={__('Invoice Number', 'surecart')}>
					{checkout?.order?.number
						? '#' + checkout?.order?.number
						: __('-', 'surecart')}
				</Definition>

				<Definition title={__('Status', 'surecart')}>
					<sc-tag type={isDraftInvoice ? 'default' : 'success'}>
						{invoice?.status?.toUpperCase()}
					</sc-tag>
				</Definition>

				<Definition title={__('Due Date', 'surecart')}>
					<ScFormatDate
						date={invoice?.due_date}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					/>
				</Definition>

				<Definition title={__('Issue Date', 'surecart')}>
					<ScFormatDate
						date={invoice?.issue_date}
						type="timestamp"
						month="long"
						day="numeric"
						year="numeric"
					/>
				</Definition>
			</Box>
		</>
	);
};
