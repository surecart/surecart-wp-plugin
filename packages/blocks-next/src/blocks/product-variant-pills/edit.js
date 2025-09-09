import { __ } from '@wordpress/i18n';
import { useEntityRecord } from '@wordpress/core-data';

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

export default ({ clientId, context: { postId } }) => {
	const blockProps = useBlockProps();

	const { record: { meta: { product } = {} } = {} } = useEntityRecord(
		'postType',
		'sc_product',
		postId
	);

	if (product?.id && !product?.variants?.data?.length) {
		return null;
	}

	return (
		<div {...blockProps}>
			<label className="sc-form-label">{__('Color', 'surecart')}</label>
			<TemplateListEdit
				template={[['surecart/product-variant-pill']]}
				blockContexts={TEST_VARIANTS}
				className={`sc-pill-option__wrapper `}
				clientId={clientId}
				renderAppender={false}
				attachBlockProps={false}
			/>
		</div>
	);
};
