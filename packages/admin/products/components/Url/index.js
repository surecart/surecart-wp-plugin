/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';
import { PanelRow, Dropdown, Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import Form from './form';

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
		<PanelRow
			css={css`
				align-items: flex-start;
				justify-content: flex-start;
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
				{__('URL')}
			</span>
			<Dropdown
				popoverProps={popoverProps}
				className="edit-post-post-url__dropdown"
				contentClassName="edit-post-post-url__dialog"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<PostURLToggle
						isOpen={isOpen}
						onClick={onToggle}
						product={product}
					/>
				)}
				renderContent={({ onClose }) => (
					<Form
						onClose={onClose}
						product={product}
						updateProduct={updateProduct}
					/>
				)}
			/>
		</PanelRow>
	);
};

function PostURLToggle({ isOpen, onClick, product }) {
	const label = `${scData?.home_url}/${scData?.product_page_slug}/${product?.slug}`;
	return (
		<Button
			css={css`
				height: auto;
				text-align: left;
				white-space: normal !important;
				word-break: break-word;
			`}
			variant="tertiary"
			aria-expanded={isOpen}
			// translators: %s: Current post URL.
			aria-label={sprintf(__('Change URL: %s'), label)}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}
