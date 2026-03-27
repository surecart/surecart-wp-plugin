/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { Button, Dropdown, PanelRow } from '@wordpress/components';
/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';
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
				{__('URL Slug', 'surecart')}
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
	const label = product?.slug;
	return (
		<Button
			css={css`
				height: auto;
				text-align: right;
				white-space: normal !important;
				word-break: break-word;
			`}
			variant="tertiary"
			aria-expanded={isOpen}
			// translators: %s: Current post URL.
			aria-label={sprintf(__('Change URL: %s', 'surecart'), label)}
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
