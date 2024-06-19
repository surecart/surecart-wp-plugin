/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	PanelRow,
	Dropdown,
	Button,
	MenuGroup,
	MenuItem,
	MenuItemsChoice,
} from '@wordpress/components';
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

	const label = 'Category';

	const onClick = () => {};

	return (
		<PanelRow>
			<span>{__('Product Type', 'surecart')}</span>
			<Dropdown
				popoverProps={popoverProps}
				className="edit-post-post-url__dropdown"
				contentClassName="edit-post-post-url__dialog"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="edit-post-post-url__toggle"
						variant="tertiary"
						aria-expanded={isOpen}
						// translators: %s: Current post status.
						aria-label={sprintf(__('Change Status: %s'), label)}
						onClick={onToggle}
					>
						{product?.tax_category === 'tangible'
							? __('Physical', 'surecart')
							: __('Digital', 'surecart')}
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
				)}
				renderContent={({ onClose }) => (
					<MenuGroup>
						<MenuItemsChoice
							choices={[
								{
									label: __('Physical', 'surecart'),
									value: 'tangible',
								},
								{
									label: __('Digital', 'surecart'),
									value: 'digital',
								},
							]}
							onSelect={(tax_category) => {
								updateProduct({
									tax_category,
								});
								onClose();
							}}
							value={product?.tax_category}
						/>
					</MenuGroup>
				)}
			/>
		</PanelRow>
	);
};
