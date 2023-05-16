/**
 * WordPress dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { PanelRow, Dropdown, Button, Spinner } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import PostTemplateForm from './form';
import { getTemplateTitle } from '../../utility';

export default function PostTemplate({ product, updateProduct }) {
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
					product?.metadata?.wp_template_part_id ||
						'surecart/surecart//product-info'
				)
			);
		},
		[product?.metadata?.wp_template_part_id]
	);

	return (
		<PanelRow className="edit-post-post-template" ref={setPopoverAnchor}>
			<span>{__('Template', 'surecart')}</span>
			<Dropdown
				popoverProps={popoverProps}
				className="edit-post-post-template__dropdown"
				contentClassName="edit-post-post-template__dialog"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<PostTemplateToggle
						isOpen={isOpen}
						onClick={onToggle}
						template={template}
					/>
				)}
				renderContent={({ onClose }) => (
					<PostTemplateForm
						onClose={onClose}
						template={template}
						product={product}
						updateProduct={updateProduct}
					/>
				)}
			/>
		</PanelRow>
	);
}

function PostTemplateToggle({ isOpen, onClick, template }) {
	const templateTitle = getTemplateTitle(template);

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
