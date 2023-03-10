import { css } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { ScProductItemTitle } from '@surecart/components-react';

import { getSpacingPresetCssVar } from '../../util';

export default ({ attributes, setAttributes }) => {
	const { title, fontSize, style: styleAttribute } = attributes;
	const { padding } = styleAttribute?.spacing || {};

	const blockProps = useBlockProps();

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
			<div {...blockProps}>
				<ScProductItemTitle
					style={{
						'--sc-product-title-font-size': `${fontSize ?? 16}px`,
					}}
				>
					{title}
				</ScProductItemTitle>
			</div>
		</>
	);
};
