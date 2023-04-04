/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';
import { PanelRow, Dropdown, Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { ScRadio, ScRadioGroup } from '@surecart/components-react';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';

export default ({ product, updateProduct }) => {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	return (
		<PanelRow className="edit-post-post-url" ref={setPopoverAnchor}>
			<span>{__('Availability')}</span>
			<Dropdown
				popoverProps={popoverProps}
				className="edit-post-post-url__dropdown"
				contentClassName="edit-post-post-url__dialog"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<ArchivedToggle
						isOpen={isOpen}
						onClick={onToggle}
						product={product}
					/>
				)}
				renderContent={({ onClose }) => (
					<div
						css={css`
							min-width: 248px;
							margin: 8px;

							.block-editor-inspector-popover-header {
								margin-bottom: 16px;
							}
							[class].block-editor-inspector-popover-header__action.has-icon {
								min-width: 24px;
								padding: 0;
							}
							[class].block-editor-inspector-popover-header__action {
								height: 24px;
							}
						`}
					>
						<InspectorPopoverHeader
							css={css`
								margin-bottom: 16px;
							`}
							title={__('Availability', 'surecart')}
							help={__(
								'Status defines whether a product is purchasable.'
							)}
							onClose={onClose}
						/>
						<ScRadioGroup>
							<ScRadio
								checked={!product?.archived}
								onClick={() =>
									updateProduct({
										archived: false,
									})
								}
							>
								{__('Available For Purchase', 'surecart')}
							</ScRadio>
							<ScRadio
								checked={product?.archived}
								onClick={() =>
									updateProduct({
										archived: true,
									})
								}
							>
								{__('Unavailable For Purchase', 'surecart')}
							</ScRadio>
						</ScRadioGroup>
					</div>
				)}
			/>
		</PanelRow>
	);
};

function ArchivedToggle({ isOpen, onClick, product }) {
	const label = product?.archived
		? __('Not Purchaseable', 'surecart')
		: __('Purchasable', 'surecart');
	return (
		<Button
			className="edit-post-post-url__toggle"
			variant="tertiary"
			aria-expanded={isOpen}
			isDestructive={product?.archived}
			// translators: %s: Current post URL.
			aria-label={sprintf(__('Change URL: %s'), label)}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}
