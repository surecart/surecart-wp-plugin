/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';
import { DatePicker, Dropdown, PanelRow } from '@wordpress/components';
import { useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScFormatDate } from '@surecart/components-react';
import PostDropdownButton from '../../components/PostDropdownButton';
import PostDropdownContent from '../../components/PostDropdownContent';

export default ({ invoice, updateInvoice }) => {
	const isDraftInvoice = invoice?.status === 'draft';

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const isInvalidDate = (date) => {
		if (invoice?.due_date) {
			const dueDate = new Date(invoice.due_date * 1000);
			dueDate.setHours(0, 0, 0, 0); // Normalize issue date to midnight

			const selectedDate = new Date(date);
			selectedDate.setHours(0, 0, 0, 0); // Normalize selected date to midnight

			return selectedDate > dueDate;
		}

		return false;
	};

	const getTitle = () => {
		return invoice?.issue_date ? (
			<ScFormatDate
				type="timestamp"
				month="short"
				day="numeric"
				year="numeric"
				date={invoice?.issue_date}
			/>
		) : isDraftInvoice ? (
			__('Today', 'surecart')
		) : (
			__('No Issue Date', 'surecart')
		);
	};

	const renderContent = ({ onClose }) => {
		return (
			<PostDropdownContent>
				<InspectorPopoverHeader
					title={__('Issue Date', 'surecart')}
					actions={
						invoice?.issue_date
							? [
									{
										label: __('Clear', 'surecart'),
										onClick: () => {
											updateInvoice({ issue_date: null });
											onClose();
										},
									},
							  ]
							: []
					}
					onClose={onClose}
				/>
				<DatePicker
					currentDate={
						invoice?.issue_date
							? new Date(invoice?.issue_date * 1000)
							: null
					}
					onChange={(date) => {
						const issueDate = new Date(date).toUTCString();
						updateInvoice({
							issue_date: Date.parse(issueDate) / 1000,
						});
						onClose();
					}}
					isInvalidDate={isInvalidDate}
				/>
			</PostDropdownContent>
		);
	};

	return (
		<PanelRow
			css={css`
				align-items: flex-start;
				justify-content: space-between;
				width: 100%;
			`}
			ref={setPopoverAnchor}
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
				<Dropdown
					popoverProps={popoverProps}
					className="edit-post-post-url__dropdown"
					contentClassName="edit-post-post-url__dialog"
					focusOnMount
					renderToggle={({ isOpen, onToggle }) => (
						<PostDropdownButton
							isOpen={isOpen}
							onClick={onToggle}
							title={getTitle()}
							ariaLabel={__('Issue Date', 'surecart')}
						/>
					)}
					renderContent={renderContent}
				/>
			) : (
				<div
					css={css`
						padding-right: var(--sc-spacing-large);
					`}
				>
					{invoice?.issue_date ? (
						<ScFormatDate
							type="timestamp"
							month="short"
							day="numeric"
							year="numeric"
							date={invoice?.issue_date}
						/>
					) : (
						'-'
					)}
				</div>
			)}
		</PanelRow>
	);
};
