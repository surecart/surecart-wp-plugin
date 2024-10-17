/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Button, Dropdown, PanelRow, Spinner } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import PostTemplateForm from './form';

export default function PostTemplate({ product, updateProduct, post }) {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	// get the assigned template.
	const template = useSelect(
		(select) => {
			const { type, slug, template: currentTemplate } = post || {};
			const { getEntityRecords } = select(coreStore);
			const selectorArgs = ['postType', 'wp_template', { per_page: -1 }];
			const templates = getEntityRecords(...selectorArgs) || [];
			const defaultTemplateId = select(coreStore).getDefaultTemplateId({
				slug: slug ? `single-${type}-${slug}` : `single-${type}`,
			});

			// have have set a current template with a slug.
			if (currentTemplate) {
				const templateWithSameSlug = templates?.find(
					(template) => template.slug === currentTemplate
				);

				if (templateWithSameSlug?.id) {
					return select(coreStore).getEditedEntityRecord(
						'postType',
						'wp_template',
						templateWithSameSlug.id
					);
				}
			}

			return select(coreStore).getEditedEntityRecord(
				'postType',
				'wp_template',
				defaultTemplateId
			);
		},
		[post?.template, post?.slug]
	);

	return (
		<PanelRow className="edit-post-post-template" ref={setPopoverAnchor}>
			<span>{__('Template')}</span>
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
								product={product}
								post={post}
								updateProduct={updateProduct}
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
		</PanelRow>
	);
}

function PostTemplateToggle({ isOpen, onClick, template }) {
	return (
		<Button
			css={css`
				height: auto;
				text-align: right;
				white-space: normal !important;
				word-break: break-word;
			`}
			className="edit-post-post-template__toggle"
			variant="tertiary"
			aria-expanded={isOpen}
			aria-label={
				template?.title
					? sprintf(
							// translators: %s: Name of the currently selected template.
							__('Select template: %s', 'surecart'),
							template?.title
					  )
					: __('Select template')
			}
			onClick={onClick}
		>
			{template?.title}
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
