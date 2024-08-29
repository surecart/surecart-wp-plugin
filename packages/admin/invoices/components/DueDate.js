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
		if (invoice?.issue_date) {
			const issueDate = new Date(invoice.issue_date * 1000);
			issueDate.setHours(0, 0, 0, 0); // Normalize issue date to midnight

			const selectedDate = new Date(date);
			selectedDate.setHours(0, 0, 0, 0); // Normalize selected date to midnight

			return selectedDate < issueDate;
		}

		return false;
	};

	const getTitle = () => {
		return invoice?.due_date ? (
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
		);
	};

	const renderContent = ({ onClose }) => {
		return (
			<PostDropdownContent>
				<InspectorPopoverHeader
					title={__('Due Date', 'surecart')}
					actions={
						invoice?.due_date
							? [
									{
										label: __('Clear', 'surecart'),
										onClick: () => {
											updateInvoice({ due_date: null });
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
						invoice?.due_date
							? new Date(invoice?.due_date * 1000)
							: null
					}
					onChange={(date) => {
						const dueDate = new Date(date).toUTCString();
						updateInvoice({
							due_date: Date.parse(dueDate) / 1000,
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
				{__('Due Date', 'surecart')}
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
							ariaLabel={__('Due Date', 'surecart')}
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
					{invoice?.due_date ? (
						<ScFormatDate
							type="timestamp"
							month="short"
							day="numeric"
							year="numeric"
							date={invoice?.due_date}
						/>
					) : (
						'-'
					)}
				</div>
			)}
		</PanelRow>
	);
};
