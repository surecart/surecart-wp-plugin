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
			<span>{__('Product Page', 'surecart')}</span>
			<Dropdown
				popoverProps={popoverProps}
				className="edit-post-post-url__dropdown"
				contentClassName="edit-post-post-url__dialog"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<StatusToggle
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
							title={__('Status', 'surecart')}
							help={__(
								'Status defines is the public product page visibilty.'
							)}
							onClose={onClose}
						/>
						<ScRadioGroup
							label={__('Product Page', 'surecart')}
							onScChange={(e) => {
								updateProduct({ status: e.target.value });
							}}
						>
							<ScRadio
								checked={product?.status !== 'published'}
								value="draft"
								name="publishing"
							>
								{__('Draft', 'surecart')}
							</ScRadio>
							<ScRadio
								checked={product?.status === 'published'}
								value="published"
								name="publishing"
							>
								{__('Published', 'surecart')}
							</ScRadio>
						</ScRadioGroup>
					</div>
				)}
			/>
		</PanelRow>
	);
};

function StatusToggle({ isOpen, onClick, product }) {
	const label =
		product?.status === 'published'
			? __('Published', 'surecart')
			: __('Draft', 'surecart');
	return (
		<Button
			className="edit-post-post-url__toggle"
			variant="tertiary"
			aria-expanded={isOpen}
			// translators: %s: Current post status.
			aria-label={sprintf(__('Change Status: %s', 'surecart'), label)}
			onClick={onClick}
		>
			{label}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={2}
				stroke="currentColor"
				width="18"
				height="18"
				style={{
					fill: 'none',
					color: 'var(--sc-color-gray-300)',
					marginLeft: '6px',
					flex: '1 0 18px',
				}}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
				/>
			</svg>
		</Button>
	);
}
