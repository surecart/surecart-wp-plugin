import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { ScProductItemTitle } from '@surecart/components-react';

import { getSpacingPresetCssVar } from '../../util';

export default ({ attributes, setAttributes }) => {
	const { title, fontSize, style: styleAttribute } = attributes;
	const { padding } = styleAttribute?.spacing || {};

	const blockProps = useBlockProps();

	console.log('attributes', attributes);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Title Settings', 'surecart')}>
					<RangeControl
						label={__('Font Size', 'surecart')}
						value={fontSize}
						onChange={(fontSize) => {
							setAttributes({ fontSize });
						}}
						min={6}
						max={40}
					/>
				</PanelBody>
			</InspectorControls>
			<div style={{ paddingBottom: '1rem' }} {...blockProps}>
				<ScProductItemTitle
					style={{
						'--sc-product-title-padding-top':
							getSpacingPresetCssVar(padding?.top) ?? '0',
						'--sc-product-title-padding-bottom':
							getSpacingPresetCssVar(padding?.bottom) ??
							'0.44rem',
						'--sc-product-title-padding-left':
							getSpacingPresetCssVar(padding?.left) ?? '0',
						'--sc-product-title-padding-right':
							getSpacingPresetCssVar(padding?.right) ?? '0',
						'--sc-product-title-font-size': `${fontSize ?? 18}px`,
					}}
				>
					{title}
				</ScProductItemTitle>
			</div>
		</>
	);
};
