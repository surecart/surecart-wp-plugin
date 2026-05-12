/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import TemplateListEdit from '../../components/TemplateListEdit';

const PREVIEW_VALUES = [__('Small', 'surecart'), __('Medium', 'surecart'), __('Large', 'surecart')];

export default ({
	context: { 'surecart/bundleItem': bundleItem },
	clientId,
}) => {
	const blockProps = useBlockProps();

	const component = bundleItem?.component_product || bundleItem?.product;
	const realOptions = component?.variant_options?.data;

	if (realOptions && realOptions.length === 0) {
		return null;
	}

	const firstOption = realOptions?.[0];
	const optionName = firstOption?.name || __('Size', 'surecart');
	const values = firstOption?.values?.length
		? firstOption.values
		: PREVIEW_VALUES;

	const blockContexts = values.map((value, index) => ({
		id: `${optionName}-${value}`,
		'surecart/bundleItemVariantPill/value': value,
		'surecart/bundleItemVariantPill/name': optionName,
		'surecart/bundleItemVariantPill/selected': index === 0,
	}));

	return (
		<div {...blockProps}>
			<TemplateListEdit
				template={[['surecart/bundle-item-variant-pill']]}
				blockContexts={blockContexts}
				className="sc-pill-option__wrapper"
				clientId={clientId}
				renderAppender={false}
				attachBlockProps={false}
			/>
		</div>
	);
};
