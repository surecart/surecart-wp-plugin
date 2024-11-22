/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import { ScText, ScTextarea } from '@surecart/components-react';
import { useInvoice } from '../hooks/useInvoice';

export default () => {
	const { invoice, editInvoice, isDraftInvoice, loading } = useInvoice();

	const renderMemoAndFooter = () => {
		if (isDraftInvoice) {
			return (
				<>
					<ScTextarea
						label={__('Memo', 'surecart')}
						value={invoice?.memo}
						onScInput={(e) => editInvoice({ memo: e.target.value })}
						help={__(
							'This appears in the memo area of your payment page, invoices and receipts.',
							'surecart'
						)}
						maxLength={1000}
					></ScTextarea>
					<ScTextarea
						label={__('Footer', 'surecart')}
						value={invoice?.footer}
						onScInput={(e) =>
							editInvoice({ footer: e.target.value })
						}
						help={__(
							'The footer appears at the bottom of your invoices and receipts.',
							'surecart'
						)}
						maxLength={1000}
					></ScTextarea>
				</>
			);
		}

		return (
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
		);
	};

	return (
		<Box title={__('Additional Options', 'surecart')} loading={loading}>
			{renderMemoAndFooter()}
		</Box>
	);
};
