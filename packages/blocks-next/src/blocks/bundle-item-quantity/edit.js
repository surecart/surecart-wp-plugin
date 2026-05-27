/**
 * WordPress dependencies.
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({
	attributes,
	setAttributes,
	context: { 'surecart/bundleItem': bundleItem },
}) => {
	const { showSingleQuantity = false } = attributes;
	const blockProps = useBlockProps({
		className: 'sc-bundle-item__qty',
	});

	const quantity = Math.max(1, Number(bundleItem?.quantity) || 1);
	const hide = !showSingleQuantity && quantity <= 1;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Quantity display', 'surecart')}>
					<ToggleControl
						label={__('Show for single items', 'surecart')}
						help={__(
							'When off, "× 1" is hidden so only components with a higher quantity show the multiplier.',
							'surecart'
						)}
						checked={showSingleQuantity}
						onChange={(value) =>
							setAttributes({ showSingleQuantity: value })
						}
					/>
				</PanelBody>
			</InspectorControls>
			{hide ? null : <span {...blockProps}>&times; {quantity}</span>}
		</>
	);
};
