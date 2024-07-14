import { __ } from '@wordpress/i18n';

import TemplateListEdit from '../../components/TemplateListEdit';
import { useBlockProps } from '@wordpress/block-editor';

const TEST_VARIANTS = [
	{
		name: 'Red',
		id: 1,
		'surecart/productVariantPill/name': 'Red',
		'surecart/productVariantPill/selected': true,
	},
	{ name: 'Blue', id: 2, 'surecart/productVariantPill/name': 'Blue' },
	{ name: 'Green', id: 3, 'surecart/productVariantPill/name': 'Green' },
];

export default ({ clientId }) => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<label class="sc-form-label">Color</label>
			<TemplateListEdit
				template={[['surecart/product-variant-pill']]}
				blockContexts={TEST_VARIANTS}
				className={`sc-pill-option__wrapper `}
				clientId={clientId}
				renderAppender={false}
			/>
		</div>
	);
};
