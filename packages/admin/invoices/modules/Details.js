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
import { ScButton, ScFormatDate, ScIcon, ScInvoiceStatusBadge } from '@surecart/components-react';

export default ({
	invoice,
	updateInvoice,
	checkout,
	loading,
	busy,
	setBusy,
}) => {
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
							/>
							{!!invoice?.due_date && (
								<ScButton
									type="text"
									onClick={() =>
										updateInvoice({ due_date: null })
									}
									css={css`
										max-width: 25px;
									`}
								>
									<ScIcon name="x"></ScIcon>
								</ScButton>
							)}
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
							/>

							{!!invoice?.issue_date && (
								<ScButton
									type="text"
									onClick={() =>
										updateInvoice({ issue_date: null })
									}
									css={css`
										max-width: 25px;
									`}
								>
									<ScIcon name="x"></ScIcon>
								</ScButton>
							)}
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
			</Box>
		</>
	);
};
