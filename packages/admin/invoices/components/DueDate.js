/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScAlert, ScFormatDate } from '@surecart/components-react';
import DatePicker from '../../components/DatePicker';
import PostDropdownButton from '../../components/PostDropdownButton';

export default ({ invoice, updateInvoice }) => {
	const isDraftInvoice = invoice?.status === 'draft';

	return (
		<PanelRow
			css={css`
				align-items: flex-start;
				justify-content: space-between;
				width: 100%;
			`}
		>
			<span
				css={css`
					display: block;
					flex-shrink: 0;
					padding: 6px 0;
					width: 45%;
				`}
			>
				{__('Due Date', 'surecart')}
			</span>

			{isDraftInvoice ? (
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
					onClear={() => {
						updateInvoice({ due_date: null });
					}}
					isInvalidDate={(date) => {
						if (invoice?.issue_date) {
							return date < new Date(invoice.issue_date * 1000);
						}

						return false;
					}}
				>
					<PostDropdownButton>
						{invoice?.due_date ? (
							<ScFormatDate
								type="timestamp"
								month="short"
								day="numeric"
								year="numeric"
								date={invoice?.due_date}
							/>
						) : isDraftInvoice ? (
							__('Set Due Date', 'surecart')
						) : (
							__('No Due Date', 'surecart')
						)}
					</PostDropdownButton>
				</DatePicker>
			) : (
				<div>
					{invoice?.due_date ? (
						<ScFormatDate
							type="timestamp"
							month="short"
							day="numeric"
							year="numeric"
							date={invoice?.due_date}
						/>
					) : (
						<ScAlert open={true} type="info">
							{__(
								'No Due date set. To set a due date, Edit the invoice and set the due date.',
								'surecart'
							)}
						</ScAlert>
					)}
				</div>
			)}
		</PanelRow>
	);
};
