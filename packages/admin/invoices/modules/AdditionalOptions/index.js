/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import InvoiceMemo from './InvoiceMemo';
import InvoiceFooter from './InvoiceFooter';
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({ invoice, updateInvoice, loading }) => {
	const isDraftInvoice = invoice?.status === 'draft';
	const [modal, setModal] = useState(false);

	return (
		<>
			<Box title={__('Additional Options', 'surecart')} loading={loading}>
				<div
					css={css`
						margin-bottom: var(--sc-spacing-x-small);
					`}
				>
					<h4
						css={css`
							margin-bottom: var(--sc-spacing-x-small);
							margin-top: 0;
						`}
					>
						{__('Memo', 'surecart')}
					</h4>
					<p>{invoice?.memo || '-'}</p>
					{isDraftInvoice && (
						<ScButton
							size="small"
							onClick={() => setModal('edit_memo')}
						>
							<ScIcon name="edit" slot="prefix"></ScIcon>
							{__('Edit', 'surecart')}
						</ScButton>
					)}
				</div>

				<div>
					<h4
						css={css`
							margin-bottom: var(--sc-spacing-x-small);
							margin-top: 0;
						`}
					>
						{__('Footer Text', 'surecart')}
					</h4>
					<p>{invoice?.footer || '-'}</p>
					{isDraftInvoice && (
						<ScButton
							size="small"
							onClick={() => setModal('edit_footer')}
						>
							<ScIcon name="edit" slot="prefix"></ScIcon>
							{__('Edit', 'surecart')}
						</ScButton>
					)}
				</div>

				{modal === 'edit_memo' && (
					<InvoiceMemo
						onRequestClose={() => setModal(false)}
						invoice={invoice}
						updateInvoice={updateInvoice}
					/>
				)}

				{modal === 'edit_footer' && (
					<InvoiceFooter
						onRequestClose={() => setModal(false)}
						invoice={invoice}
						updateInvoice={updateInvoice}
					/>
				)}
			</Box>
		</>
	);
};
