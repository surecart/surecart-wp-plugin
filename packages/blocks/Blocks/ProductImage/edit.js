/**
 * WordPress dependencies
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { ScProductImage } from '@surecart/components-react';
import { getSpacingPresetCssVar } from '../../util';

export default ({ attributes, setAttributes }) => {
	const { src, alt, sizing, style: styleAttribute } = attributes;
	const { padding, margin } = styleAttribute?.spacing || {};

	const blockProps = useBlockProps();
	const { style } = useBorderProps(attributes);

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Image Attribute', 'surecart')}>
					<ToggleGroupControl
						label={__('Image Cropping', 'surecart')}
						value={sizing}
						onChange={(value) => setAttributes({ sizing: value })}
					>
						<ToggleGroupControlOption
							value="contain"
							label={__('Contain', 'surecart')}
						/>
						<ToggleGroupControlOption
							value="cover"
							label={__('Cover', 'surecart')}
						/>
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>
			<div
				{...blockProps}
				css={css`
					padding: 0 !important;
					margin: 0 !important;
					border: none !important;
				`}
			>
				<ScProductImage
					alt={alt}
					src={src}
					sizing={sizing}
					style={{
						'--sc-product-image-border-color': style?.borderColor,
						'--sc-product-image-border-radius': style?.borderRadius,
						'--sc-product-image-border-width': style?.borderWidth,
						'--sc-product-image-padding-top':
							getSpacingPresetCssVar(padding?.top),
						'--sc-product-image-padding-bottom':
							getSpacingPresetCssVar(padding?.bottom),
						'--sc-product-image-padding-left':
							getSpacingPresetCssVar(padding?.left),
						'--sc-product-image-padding-right':
							getSpacingPresetCssVar(padding?.right),
						'--sc-product-image-margin-top': getSpacingPresetCssVar(
							margin?.top
						),
						'--sc-product-image-margin-bottom':
							getSpacingPresetCssVar(margin?.bottom),
						'--sc-product-image-margin-left':
							getSpacingPresetCssVar(margin?.left),
						'--sc-product-image-margin-right':
							getSpacingPresetCssVar(margin?.right),
					}}
				/>
			</div>
		</Fragment>
	);
};
