/**
 * External dependencies
 */
import classnames from 'classnames';

import {
	InspectorControls,
	RichText,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetElementClassName,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	__experimentalBoxControl as BoxControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({ className, attributes, setAttributes }) => {
	const {
		text,
		textAlign,
		style,
		padding,
		border,
		backgroundColor,
		textColor,
	} = attributes;

	const blockProps = useBlockProps({
		style: {
			width: '100%',
			'box-sizing': 'border-box',
			...(padding?.top ? { paddingTop: padding?.top } : {}),
			...(padding?.bottom ? { paddingBottom: padding?.bottom } : {}),
			...(padding?.left ? { paddingLeft: padding?.left } : {}),
			...(padding?.right ? { paddingRight: padding?.right } : {}),
		},
	});

	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);

	return (
		<>
			<InspectorControls>
				<PanelColorSettings
					title={__('Section Color', 'surecart')}
					colorSettings={[
						{
							value: backgroundColor,
							onChange: (backgroundColor) =>
								setAttributes({ backgroundColor }),
							label: __('Background Color', 'surecart'),
						},
					]}
				/>
				<PanelBody title={__('Spacing', 'surecart')}>
					<BoxControl
						label={__('Padding', 'surecart')}
						values={padding}
						resetValues={{
							top: '1.25em',
							right: '1.25em',
							bottom: '1.25em',
							left: '1.25em',
						}}
						onChange={(padding) => setAttributes({ padding })}
					/>
				</PanelBody>
				<PanelBody title={__('Border', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__('Bottom Border', 'surecart')}
							checked={border}
							onChange={(border) => setAttributes({ border })}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div class="wp-block-buttons">
				<div
					{...blockProps}
					className={classnames(blockProps.className, {
						'wp-block-button': true,
						[`has-custom-font-size`]: blockProps.style.fontSize,
					})}
				>
					<RichText
						aria-label={__('Button text')}
						placeholder={__('Add text…')}
						className={classnames(
							className,
							'wp-block-button__link',
							colorProps.className,
							borderProps.className,
							{
								[`has-text-align-${textAlign}`]: textAlign,
								// For backwards compatibility add style that isn't
								// provided via block support.
								'no-border-radius': style?.border?.radius === 0,
							},
							__experimentalGetElementClassName('button')
						)}
						style={{
							...borderProps.style,
							...colorProps.style,
							width: '100%',
						}}
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</div>
			</div>
		</>
	);
};
