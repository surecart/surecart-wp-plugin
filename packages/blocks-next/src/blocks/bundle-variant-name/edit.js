/**
 * WordPress dependencies
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({
	attributes,
	setAttributes,
	context: {
		'surecart/bundleItem': bundleItem,
		'surecart/bundleItemOption': bundleItemOption,
	},
}) => {
	const { separator = '' } = attributes;
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__variant-name',
	});

	const optionName =
		bundleItemOption?.name ||
		bundleItem?.component_product?.variant_options?.data?.[0]?.name ||
		bundleItem?.product?.variant_options?.data?.[0]?.name ||
		__('Variant Option Name', 'surecart');

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__('Separator', 'surecart')}
					initialOpen={false}
				>
					<TextControl
						label={__('Separator', 'surecart')}
						help={__(
							'Shown before the variant name. Leave empty to hide.',
							'surecart'
						)}
						value={separator}
						onChange={(value) =>
							setAttributes({ separator: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			<span {...blockProps}>
				{!!separator && (
					<span aria-hidden="true">{separator}</span>
				)}
				{optionName}
			</span>
		</>
	);
};
