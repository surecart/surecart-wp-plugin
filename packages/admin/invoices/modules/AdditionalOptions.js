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
	const renderMemoAndFooter = () => {
		if (invoice?.status === 'draft') {
			return (
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
							'The footer appears at the bottom of your invoices and receipts.',
							'surecart'
						)}
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
		<>
			<Box title={__('Additional Options', 'surecart')} loading={loading}>
				{renderMemoAndFooter()}
			</Box>
		</>
	);
};
