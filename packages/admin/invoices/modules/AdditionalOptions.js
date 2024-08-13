/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScText, ScTextarea } from '@surecart/components-react';

export default ({ invoice, updateInvoice, loading }) => {
	const isDraftInvoice = invoice?.status === 'draft';

	return (
		<>
			<Box title={__('Additional Options', 'surecart')} loading={loading}>
				{isDraftInvoice ? (
					<>
						<ScTextarea
							label={__('Memo', 'surecart')}
							value={invoice?.memo}
							onScInput={(e) =>
								updateInvoice({ memo: e.target.value })
							}
							help={__(
								'This appears in the memo area of your invoices and receipts.',
								'surecart'
							)}
						></ScTextarea>
						<ScTextarea
							label={__('Footer', 'surecart')}
							value={invoice?.footer}
							onScInput={(e) =>
								updateInvoice({ footer: e.target.value })
							}
							help={__(
								'The default memo that is shown on all order statements (i.e. invoices and receipts).',
								'surecart'
							)}
						></ScTextarea>
					</>
				) : (
					<>
						<ScText
							tag="h3"
							style={{
								'--font-weight': 'var(--sc-font-weight-bold)',
								'--font-size': 'var(--sc-font-size-medium)',
							}}
						>
							{__('Memo', 'surecart')}
						</ScText>
						<ScText>{invoice?.memo || '-'}</ScText>

						<ScText
							tag="h3"
							style={{
								'--font-weight': 'var(--sc-font-weight-bold)',
								'--font-size': 'var(--sc-font-size-medium)',
							}}
						>
							{__('Footer', 'surecart')}
						</ScText>
						<ScText>{invoice?.footer || '-'}</ScText>
					</>
				)}
			</Box>
		</>
	);
};
