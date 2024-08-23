/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useMemo, useState } from '@wordpress/element';
import { Dropdown, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import PostDropdownButton from '../../components/PostDropdownButton';
import PostDropdownContent from '../../components/PostDropdownContent';
import DatePicker from '../../components/DatePicker';
import { ScFormatDate } from '@surecart/components-react';

export default ({ invoice, updateInvoice }) => {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const renderContent = ({ onClose }) => {
		return (
			<PostDropdownContent>
				<InspectorPopoverHeader
					title={__('Invoice Issue Date')}
					onClose={onClose}
					help={__(
						'The date on which the invoice was issued.',
						'surecart'
					)}
				/>

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
						onClose();
					}}
					onClear={() => {
						updateInvoice({ issue_date: null });
						onClose();
					}}
					onRequestClose={onClose}
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
			<Dropdown
				popoverProps={popoverProps}
				className="edit-post-post-url__dropdown"
				contentClassName="edit-post-post-url__dialog"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<PostDropdownButton
						isOpen={isOpen}
						onClick={onToggle}
						title={
							invoice?.issue_date ? (
								<ScFormatDate
									type="timestamp"
									month="short"
									day="numeric"
									year="numeric"
									date={invoice?.issue_date}
								/>
							) : (
								__('Set Issue Date', 'surecart')
							)
						}
					/>
				)}
				renderContent={renderContent}
			/>
		</PanelRow>
	);
};
