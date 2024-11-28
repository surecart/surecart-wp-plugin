/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useState, useMemo } from '@wordpress/element';
import { PanelRow, Dropdown, Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies.
 */
import PostTemplateForm from './form';
import { getTemplateTitle } from '../../../products/utility';

export default function SelectTemplatePart({ collection, updateCollection }) {
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
					'wp_template_part',
					collection?.metadata?.wp_template_part_id ||
						'surecart/surecart//product-collection-part'
				)
			);
		},
		[collection?.metadata?.wp_template_part_id]
	);

	return (
		<PanelRow className="edit-post-post-template" ref={setPopoverAnchor}>
			<span>{__('Template', 'surecart')}</span>
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
				renderToggle={({ isOpen, onToggle }) => (
					<PostTemplateToggle
						isOpen={isOpen}
						collection={collection}
						onClick={onToggle}
						template={template}
					/>
				)}
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
								collection={collection}
								updateCollection={updateCollection}
							/>
						</div>
						<a
							href={addQueryArgs('site-editor.php', {
								postType: 'wp_template_part',
								path: '/wp_template_part/all',
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
							{__('Manage all template parts', 'surecart')}
						</a>
					</>
				)}
			/>
		</PanelRow>
	);
}

function PostTemplateToggle({ isOpen, onClick, collection, template }) {
	// possibly convert "0" to false
	const wp_template_id =
		collection?.metadata?.wp_template_id &&
		collection?.metadata?.wp_template_id !== '0'
			? collection?.metadata?.wp_template_id
			: false;

	const templateTitle = wp_template_id
		? getTemplateTitle(template)
		: __('Theme', 'surecart');

	return (
		<Button
			className="edit-post-post-template__toggle"
			variant="tertiary"
			aria-expanded={isOpen}
			aria-label={
				templateTitle
					? sprintf(
							// translators: %s: Name of the currently selected template.
							__('Select template: %s', 'surecart'),
							templateTitle
					  )
					: __('Select template', 'surecart')
			}
			onClick={onClick}
		>
			{templateTitle ?? __('Select template', 'surecart')}
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
