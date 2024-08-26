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
				{__('Issue Date', 'surecart')}
			</span>

			{isDraftInvoice ? (
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
							issue_date: Date.parse(issue_date) / 1000,
						});
					}}
					onClear={() => {
						updateInvoice({ issue_date: null });
					}}
				>
					<PostDropdownButton>
						{invoice?.issue_date ? (
							<ScFormatDate
								type="timestamp"
								month="short"
								day="numeric"
								year="numeric"
								date={invoice?.issue_date}
							/>
						) : isDraftInvoice ? (
							__('Set Issue Date', 'surecart')
						) : (
							__('No Issue Date', 'surecart')
						)}
					</PostDropdownButton>
				</DatePicker>
			) : (
				<div>
					{invoice?.issue_date ? (
						<ScFormatDate
							type="timestamp"
							month="short"
							day="numeric"
							year="numeric"
							date={invoice?.issue_date}
						/>
					) : (
						<ScAlert open={true} type="info">
							{__(
								'No issue date set. To set an issue date, Edit the invoice and set the issue date.',
								'surecart'
							)}
						</ScAlert>
					)}
				</div>
			)}
		</PanelRow>
	);
};
