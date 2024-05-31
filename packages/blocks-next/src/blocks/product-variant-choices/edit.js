import { __ } from '@wordpress/i18n';

import TemplateListEdit from '../../components/TemplateListEdit';
import { useBlockProps } from '@wordpress/block-editor';

const TEST_VARIANTS = [
	{
		name: 'Red',
		id: 1,
		'surecart/productVariantChoice/name': 'Red',
		'surecart/productVariantChoice/selected': true,
	},
	{ name: 'Blue', id: 2, 'surecart/productVariantChoice/name': 'Blue' },
	{ name: 'Green', id: 3, 'surecart/productVariantChoice/name': 'Green' },
];

export default ({ __unstableLayoutClassNames, clientId }) => {
	const blockProps = useBlockProps();

	return (
		<div class="sc-product-variants__wrapper">
			<div {...blockProps}>
				<label className="sc-form-label">
					{__('Colors', 'surecart')}
				</label>
				<TemplateListEdit
					template={[['surecart/product-variant-choice-v2']]}
					blockContexts={TEST_VARIANTS}
					className={`sc-pill-option__wrapper ${__unstableLayoutClassNames}`}
					clientId={clientId}
					renderAppender={false}
					attachBlockProps={false}
				/>
			</div>
		</div>
	);
};
