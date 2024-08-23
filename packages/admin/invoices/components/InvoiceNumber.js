/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useMemo, useState } from '@wordpress/element';
import { Dropdown, PanelRow } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import PostDropdownButton from '../../components/PostDropdownButton';
import PostDropdownContent from '../../components/PostDropdownContent';

export default ({ orderNumber }) => {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const renderContent = ({ onClose }) => (
		<PostDropdownContent>
			<InspectorPopoverHeader
				title={__('Invoice Number')}
				onClose={onClose}
				help={__(
					'The unique number assigned to the invoice.',
					'surecart'
				)}
			/>
			<span>#{orderNumber}</span>
		</PostDropdownContent>
	);

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
				{__('Invoice Number', 'surecart')}
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
						title={`#${orderNumber}`}
						ariaLabel={sprintf(
							/* translators: %s: invoice number */
							__('Invoice Number: %s', 'surecart'),
							orderNumber
						)}
					/>
				)}
				renderContent={renderContent}
			/>
		</PanelRow>
	);
};
