import { __ } from '@wordpress/i18n';
import TemplateListEdit from '../../components/TemplateListEdit';
import { RichText, useBlockProps } from '@wordpress/block-editor';

const TEMPLATE = [['surecart/product-list-sort-radio']];

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
						id: 'date:desc',
						'surecart/radio/name': __('Latest'),
					},
					{
						id: 'date:asc',
						'surecart/radio/name': __('Oldest'),
					},
					{
						id: 'price:desc',
						'surecart/radio/name': __('Price, low to high'),
					},
					{
						id: 'price:asc',
						'surecart/radio/name': __('Price, high to low'),
					},
				]}
				className={__unstableLayoutClassNames}
				clientId={clientId}
				renderAppender={false}
			/>
		</div>
	);
};
