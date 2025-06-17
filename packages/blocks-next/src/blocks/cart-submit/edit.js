/**
 * External dependencies
 */
import classnames from 'classnames';

import {
	InspectorControls,
	RichText,
	useBlockProps,
	__experimentalGetElementClassName,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	__experimentalBoxControl as BoxControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ColorInspectorControl from '../../components/ColorInspectorControl';

export default ({ className, attributes, setAttributes, clientId }) => {
	const { text, style, padding, border, sectionBackgroundColor } = attributes;

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const shadowProps = useShadowProps(attributes);

	const blockProps = useBlockProps({
		className: 'sc-cart-submit__wrapper wp-block-buttons',
	});

	return (
		<>
			{/* Additional color inspector control. */}
			<ColorInspectorControl
				settings={[
					{
						colorValue: sectionBackgroundColor,
						label: __('Section Color', 'surecart'),
						onColorChange: (sectionBackgroundColor) =>
							setAttributes({ sectionBackgroundColor }),
						resetAllFilter: () =>
							setAttributes({
								sectionBackgroundColor: undefined,
							}),
					},
				]}
				panelId={clientId}
			/>

			<InspectorControls>
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

			<div
				{...blockProps}
				style={{
					width: '100%',
					'box-sizing': 'border-box',
					...(padding?.top ? { paddingTop: padding?.top } : {}),
					...(padding?.bottom
						? { paddingBottom: padding?.bottom }
						: {}),
					...(padding?.left ? { paddingLeft: padding?.left } : {}),
					...(padding?.right ? { paddingRight: padding?.right } : {}),
					...(sectionBackgroundColor
						? { backgroundColor: sectionBackgroundColor }
						: {}),
				}}
			>
				<div
					className={{
						'wp-block-button': true,
						'sc-block-button': true,
						[`has-custom-font-size`]: blockProps.style.fontSize,
					}}
				>
					<RichText
						aria-label={__('Button text', 'surecart')}
						placeholder={__('Add text…', 'surecart')}
						className={classnames(
							className,
							'wp-block-button__link',
							'sc-block-button__link',
							colorProps.className,
							borderProps.className,
							spacingProps.className,
							shadowProps.className,
							{
								// For backwards compatibility add style that isn't
								// provided via block support.
								'no-border-radius': style?.border?.radius === 0,
							},
							__experimentalGetElementClassName('button')
						)}
						style={{
							...borderProps.style,
							...spacingProps.style,
							...shadowProps.style,
							...colorProps.style,
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
