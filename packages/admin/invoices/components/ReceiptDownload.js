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
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({ orderPdfUrl }) => {
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
				title={__('Download Receipt')}
				onClose={onClose}
				help={__('The receipt for the order.', 'surecart')}
			/>

			<ScButton href={orderPdfUrl} target="_blank">
				{__('Download')} &nbsp;
				<ScIcon slot="prefix" name="download" />
			</ScButton>
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
				{__('Receipt', 'surecart')}
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
						title={__('Download', 'surecart')}
					/>
				)}
				renderContent={renderContent}
			/>
		</PanelRow>
	);
};
