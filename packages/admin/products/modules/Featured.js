/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScIcon, ScSwitch } from '@surecart/components-react';
import { Dropdown } from '@wordpress/components';
import { __experimentalInspectorPopoverHeader as InspectorPopoverHeader } from '@wordpress/block-editor';
import { useMemo, useState } from 'react';
import { __ } from '@wordpress/i18n';

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
		<Dropdown
			popoverProps={popoverProps}
			className="edit-post-post-template__dropdown"
			contentClassName="edit-post-post-template__dialog"
			focusOnMount
			css={css`
				.components-dropdown__content .components-popover__content {
					min-width: 240px;
				}
			`}
			renderToggle={({ isOpen, onToggle }) => (
				<ScButton
					size="small"
					onClick={onToggle}
					type={product?.featured ? 'primary' : 'default'}
				>
					<ScIcon
						slot="prefix"
						name="star"
						css={css`
							--sc-icon-stroke-width: 3px;
							cursor: pointer;
						`}
					/>
					{product?.featured
						? __('Featured', 'surecart')
						: __('Feature', 'surecart')}
				</ScButton>
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
						title={__('Featured', 'surecart')}
						help={__(
							'Mark products as featured to display them in various featured areas of your site.'
						)}
						onClose={onClose}
					/>

					<ScSwitch
						checked={product?.featured}
						onScChange={(e) =>
							updateProduct({
								featured: e.target.checked,
							})
						}
					>
						{__('Feature This Product', 'surecart')}
					</ScSwitch>
				</div>
			)}
		/>
	);
};
