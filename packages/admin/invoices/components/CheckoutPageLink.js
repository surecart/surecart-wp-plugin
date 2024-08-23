/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useMemo, useState } from '@wordpress/element';
import { Dropdown, PanelRow } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCopyToClipboard } from '@wordpress/compose';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';
import { ExternalLink } from '@wordpress/components';
import { store as noticesStore } from '@wordpress/notices';
import { useDispatch } from '@wordpress/data';

/**
 * Internal dependencies.
 */
import PostDropdownButton from '../../components/PostDropdownButton';
import PostDropdownContent from '../../components/PostDropdownContent';
import { ScButton, ScIcon } from '@surecart/components-react';

export default ({ checkoutPageUrl }) => {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const { createSuccessNotice } = useDispatch(noticesStore);

	const checkoutPageUrlRef = useCopyToClipboard(checkoutPageUrl, () =>
		createSuccessNotice(
			__('Checkout Page URL Copied to clipboard.', 'surecart'),
			{
				type: 'snackbar',
			}
		)
	);

	const renderContent = ({ onClose }) => (
		<PostDropdownContent>
			<InspectorPopoverHeader
				title={__('Checkout Page', 'surecart')}
				onClose={onClose}
			/>

			<ScButton
				ref={checkoutPageUrlRef}
				css={css`
					margin-bottom: 16px;
				`}
			>
				{__('Copy URL')} &nbsp;
				<ScIcon slot="prefix" name="copy" />
			</ScButton>

			<h3
				css={css`
					line-height: 1.2;
					color: rgb(30, 30, 30);
					font-size: 13px;
					font-weight: 600;
					display: block;
				`}
			>
				{__('View Checkout Page')}
			</h3>

			<p>
				<ExternalLink
					className="editor-post-url__link"
					href={checkoutPageUrl}
					target="_blank"
				>
					{checkoutPageUrl}
				</ExternalLink>
			</p>
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
				{__('Checkout Page', 'surecart')}
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
						title={__('View / Copy URL', 'surecart')}
						ariaLabel={__(
							'View / Copy Checkout Page URL',
							'surecart'
						)}
					/>
				)}
				renderContent={renderContent}
			/>
		</PanelRow>
	);
};
