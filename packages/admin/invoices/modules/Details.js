/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import DatePicker from '../../components/DatePicker';
import { ScFormatDate, ScInvoiceStatusBadge } from '@surecart/components-react';
import { ExternalLink } from '@wordpress/components';

export default ({ invoice, updateInvoice, checkout, loading, busy }) => {
	const isDraftInvoice = invoice?.status === 'draft';

	const paymentPageUrl = checkout?.id
		? `${window.scData?.checkout_page_url}?checkout_id=${checkout?.id}`
		: null;

	const orderPdfUrl = checkout?.order?.pdf_url;

	const getTrancatedUrl = (url, baseUrl, maxChars = 30) => {
		baseUrl = baseUrl || window.scData?.home_url;
		return (
			url.replace(baseUrl, '').substring(0, maxChars) +
			(url.replace(baseUrl, '').length > maxChars ? '...' : '')
		);
	};

	return (
		<>
			<Box title={__('', 'surecart')} loading={loading}>
				{!!checkout?.order?.number && (
					<Definition title={__('Invoice Number', 'surecart')}>
						#{checkout.order.number}
					</Definition>
				)}

				<Definition title={__('Status', 'surecart')}>
					<ScInvoiceStatusBadge status={invoice?.status} />
				</Definition>

				<Definition title={__('Due Date', 'surecart')}>
					{isDraftInvoice ? (
						<div
							css={css`
								display: flex;
							`}
						>
							<DatePicker
								title={__('Choose a due date', 'surecart')}
								placeholder={__('Due date', 'surecart')}
								currentDate={
									invoice?.due_date
										? new Date(invoice?.due_date * 1000)
										: null
								}
								onChoose={(due_date) => {
									updateInvoice({
										due_date: Date.parse(due_date) / 1000,
									});
								}}
								onClear={() =>
									updateInvoice({ due_date: null })
								}
							/>
						</div>
					) : invoice?.due_date ? (
						<ScFormatDate
							date={invoice?.due_date}
							type="timestamp"
							month="long"
							day="numeric"
							year="numeric"
						/>
					) : (
						'-'
					)}
				</Definition>

				<Definition title={__('Issue Date', 'surecart')}>
					{isDraftInvoice ? (
						<div
							css={css`
								display: flex;
							`}
						>
							<DatePicker
								title={__('Choose an issue date', 'surecart')}
								placeholder={__('Issue date', 'surecart')}
								currentDate={
									invoice?.issue_date
										? new Date(invoice?.issue_date * 1000)
										: null
								}
								onChoose={(issue_date) => {
									updateInvoice({
										issue_date:
											Date.parse(issue_date) / 1000,
									});
								}}
								onClear={() =>
									updateInvoice({ issue_date: null })
								}
							/>
						</div>
					) : invoice?.issue_date ? (
						<ScFormatDate
							date={invoice?.issue_date}
							type="timestamp"
							month="long"
							day="numeric"
							year="numeric"
						/>
					) : (
						'-'
					)}
				</Definition>

				{!!paymentPageUrl && (
					<Definition title={__('Payment Page', 'surecart')}>
						<ExternalLink
							className="editor-post-url__link"
							href={paymentPageUrl}
							target="_blank"
						>
							{getTrancatedUrl(paymentPageUrl)}
						</ExternalLink>
					</Definition>
				)}

				{!!orderPdfUrl && (
					<Definition title={__('PDF Link', 'surecart')}>
						<ExternalLink
							className="editor-post-url__link"
							href={orderPdfUrl}
							target="_blank"
						>
							{getTrancatedUrl(orderPdfUrl)}
						</ExternalLink>
					</Definition>
				)}
			</Box>
		</>
	);
};
