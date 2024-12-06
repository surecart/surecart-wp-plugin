import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import { RichText, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [['surecart/product-list-filter-tag']];

export default ({
	clientId,
	__unstableLayoutClassNames,
	attributes: { label },
	setAttributes,
}) => {
	const blockProps = useBlockProps({
		className: __unstableLayoutClassNames,
	});
	return (
		<div {...blockProps}>
			<RichText
				tagName="span"
				aria-label={__('Label text', 'surecart')}
				placeholder={__('Add label…', 'surecart')}
				value={label}
				onChange={(label) => setAttributes({ label })}
				withoutInteractiveFormatting
				allowedFormats={['core/bold', 'core/italic']}
			/>
			<TemplateListEdit
				template={TEMPLATE}
				blockContexts={[
					{
						id: 'filter-1',
						'surecart/filterTag/name': __('Filter 1'),
					},
					{
						id: 'filter-2',
						'surecart/filterTag/name': __('Filter 2'),
					},
					{
						id: 'filter-3',
						'surecart/filterTag/name': __('Filter 3'),
					},
				]}
				className={__unstableLayoutClassNames}
				clientId={clientId}
			/>
		</div>
	);
};
