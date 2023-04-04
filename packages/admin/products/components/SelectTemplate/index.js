/**
 * WordPress dependencies
 */
import { useState, useMemo } from '@wordpress/element';
import { PanelRow, Dropdown, Button } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import PostTemplateForm from './form';

export default function PostTemplate({ templateId, product, updateProduct }) {
	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const [popoverAnchor, setPopoverAnchor] = useState(null);
	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ({ anchor: popoverAnchor, placement: 'bottom-end' }),
		[popoverAnchor]
	);

	return (
		<PanelRow className="edit-post-post-template" ref={setPopoverAnchor}>
			<span>{__('Template')}</span>
			<Dropdown
				popoverProps={popoverProps}
				className="edit-post-post-template__dropdown"
				contentClassName="edit-post-post-template__dialog"
				focusOnMount
				renderToggle={({ isOpen, onToggle }) => (
					<PostTemplateToggle
						isOpen={isOpen}
						onClick={onToggle}
						product={product}
					/>
				)}
				renderContent={({ onClose }) => (
					<PostTemplateForm onClose={onClose} />
				)}
			/>
		</PanelRow>
	);
}

function PostTemplateToggle({ isOpen, onClick, product }) {
	const templateTitle = useSelect((select) => {
		const template =
			select(coreStore).canUser('create', 'templates') &&
			select(coreStore).getEntityRecord(
				'postType',
				'wp_template',
				product?.metadata?.wp_template_id ||
					'surecart/surecart//single-product'
			);
		return (
			template?.title?.rendered ||
			template?.slug ||
			__('Default template', 'surecart')
		);
	}, []);

	return (
		<Button
			className="edit-post-post-template__toggle"
			variant="tertiary"
			aria-expanded={isOpen}
			aria-label={
				templateTitle
					? sprintf(
							// translators: %s: Name of the currently selected template.
							__('Select template: %s'),
							templateTitle
					  )
					: __('Select template')
			}
			onClick={onClick}
		>
			{templateTitle ?? __('Default template')}
		</Button>
	);
}
