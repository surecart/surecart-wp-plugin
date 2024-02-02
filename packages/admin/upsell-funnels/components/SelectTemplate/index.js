/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Dropdown, PanelRow } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import PostTemplateForm from './form';
import { getTemplateTitle } from '../../../util/templates';

export default function PostTemplate({ upsell, updateUpsell, renderToggle }) {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	const template = useSelect(
		(select) => {
			return (
				select(coreStore).canUser('create', 'templates') &&
				select(coreStore).getEntityRecord(
					'postType',
					'wp_template',
					upsell?.metadata?.wp_template_id ||
						'surecart/surecart//single-upsell'
				)
			);
		},
		[upsell?.metadata?.wp_template_id]
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
					padding: 0;
				}
			`}
			renderToggle={renderToggle}
			renderContent={({ onClose }) => (
				<>
					<div
						css={css`
							margin: 0;
							padding: 8px;
						`}
					>
						<PostTemplateForm
							onClose={onClose}
							template={template}
							upsell={upsell}
							updateUpsell={updateUpsell}
						/>
					</div>
					<a
						href={addQueryArgs('site-editor.php', {
							path: '/wp_template/all',
						})}
						className="components-button"
						css={css`
							background: #1e1e1e;
							border-radius: 0;
							color: #fff;
							display: flex;
							height: 44px;
							justify-content: center;
							width: 100%;

							&:hover,
							&:active,
							&:focus {
								color: #fff !important;
							}
						`}
					>
						{__('Manage all templates', 'surecart')}
					</a>
				</>
			)}
		/>
	);
}
