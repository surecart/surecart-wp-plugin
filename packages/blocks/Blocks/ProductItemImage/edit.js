/**
 * WordPress dependencies
 */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { Fragment, useState } from '@wordpress/element';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import {
	Button,
	Modal,
	PanelBody,
	RangeControl,
	ResizableBox,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	ToolbarItem,
	ToolbarGroup,
} from '@wordpress/components';
import { ScProductItemImage } from '@surecart/components-react';
import { getSpacingPresetCssVar } from '../../util';
import AspectRatioDropdown from './aspect-ratio-dropdown';

export default ({ attributes, setAttributes }) => {
	const { src, sizing, ratio, style: styleAttribute } = attributes;
	const { padding, margin } = styleAttribute?.spacing || {};
	const [modal, setModal] = useState(false);

	const blockProps = useBlockProps();
	const { style } = useBorderProps(attributes);

	function decimalToAspectRatio(decimal, precision = 0.01) {
		// Find the greatest common divisor
		function gcd(a, b) {
			return b === 0 ? a : gcd(b, a % b);
		}

		let numerator = 1;
		let denominator = Math.round(numerator / decimal);

		while (Math.abs(numerator / denominator - decimal) > precision) {
			numerator++;
			denominator = Math.round(numerator / decimal);
		}

		// Simplify the fraction using gcd
		const divisor = gcd(numerator, denominator);
		numerator /= divisor;
		denominator /= divisor;

		return `${numerator} / ${denominator}`;
	}

	return (
		<Fragment>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarItem>
						{(toggleProps) => (
							<AspectRatioDropdown
								toggleProps={toggleProps}
								aspect={ratio}
								setAspect={(ratio) =>
									setAttributes({
										ratio: decimalToAspectRatio(ratio),
									})
								}
							/>
						)}
					</ToolbarItem>
				</ToolbarGroup>

				{!!modal && (
					<Modal
						title={__('Set Aspect Ratio', 'surecart')}
						onRequestClose={() => setModal(false)}
					>
						<RangeControl
							label={__('Aspect Ratio', 'surecart')}
							value={ratio}
							onChange={(value) =>
								setAttributes({ ratio: value })
							}
							min={0.1}
							max={10}
							step={0.1}
						/>
						<Button
							variant="primary"
							onClick={() => setModal(false)}
						>
							{__('Set Aspect Ratio', 'surecart')}
						</Button>
					</Modal>
				)}
			</BlockControls>
			<InspectorControls>
				<PanelBody>
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
				<ResizableBox
					minHeight={100}
					style={{
						marginTop: getSpacingPresetCssVar(margin?.top),
						marginBottom: getSpacingPresetCssVar(margin?.bottom),
						marginLeft: getSpacingPresetCssVar(margin?.left),
						marginRight: getSpacingPresetCssVar(margin?.right),
					}}
					enable={{
						top: false,
						right: false,
						bottom: true,
						left: false,
					}}
					onResizeStop={(ev, dr, el, d) => {
						el.style.height = '';
					}}
					onResize={(ev, dr, el, d) => {
						setAttributes({
							ratio: `1/${el.offsetHeight / el.offsetWidth}`,
						});
					}}
				>
					<ScProductItemImage
						src={src}
						sizing={sizing}
						style={{
							'--sc-product-image-aspect-ratio': ratio,
							'--sc-product-image-border-color':
								style?.borderColor,
							'--sc-product-image-border-radius':
								style?.borderRadius,
							'--sc-product-image-border-width':
								style?.borderWidth,
							'--sc-product-image-padding-top':
								getSpacingPresetCssVar(padding?.top),
							'--sc-product-image-padding-bottom':
								getSpacingPresetCssVar(padding?.bottom),
							'--sc-product-image-padding-left':
								getSpacingPresetCssVar(padding?.left),
							'--sc-product-image-padding-right':
								getSpacingPresetCssVar(padding?.right),
						}}
					/>
				</ResizableBox>
			</div>
		</Fragment>
	);
};
