/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useMemo, useState } from '@wordpress/element';
import { Button, Dropdown, PanelRow } from '@wordpress/components';
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
import { ScIcon } from '@surecart/components-react';

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
		createSuccessNotice(__('URL copied to clipboard.', 'surecart'), {
			type: 'snackbar',
		})
	);

	const renderContent = ({ onClose }) => (
		<PostDropdownContent>
			<InspectorPopoverHeader
				title={__('Payment Page', 'surecart')}
				onClose={onClose}
			/>

			<Button
				variant="secondary"
				ref={checkoutPageUrlRef}
				onClick={onClose}
			>
				{__('Copy URL')} &nbsp;
				<ScIcon slot="prefix" name="copy" />
			</Button>

			<h3
				css={css`
					line-height: 1.2;
					color: rgb(30, 30, 30);
					font-size: 13px;
					font-weight: 600;
					display: block;
				`}
			>
				{__('View Payment Page')}
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
		<PanelRow ref={setPopoverAnchor}>
			<span>{__('Payment Page', 'surecart')}</span>
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
							'View / Copy Payment Page URL',
							'surecart'
						)}
						css={css`
							margin-right: -18px;
						`}
					/>
				)}
				renderContent={renderContent}
			/>
		</PanelRow>
	);
};
