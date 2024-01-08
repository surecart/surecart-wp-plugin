/**
 * External dependencies.
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import {
	RichText,
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';
import { isKeyboardEvent } from '@wordpress/keycodes';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';

function WidthPanel({ selectedWidth, setAttributes }) {
	function handleChange(newWidth) {
		// Check if we are toggling the width off
		const width = selectedWidth === newWidth ? undefined : newWidth;

		// Update attributes.
		setAttributes({ width });
	}

	return (
		<PanelBody title={__('Width settings', 'surecart')}>
			<ButtonGroup aria-label={__('Button width', 'surecart')}>
				{[25, 50, 75, 100].map((widthValue) => {
					return (
						<Button
							key={widthValue}
							isSmall
							variant={
								widthValue === selectedWidth
									? 'primary'
									: undefined
							}
							onClick={() => handleChange(widthValue)}
						>
							{widthValue}%
						</Button>
					);
				})}
			</ButtonGroup>
		</PanelBody>
	);
}

export default ({ className, attributes, setAttributes }) => {
	const { type, text, size, width, textAlign, style } = attributes;

	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const ref = useRef();
	const richTextRef = useRef();

	function onKeyDown(event) {
		if (isKeyboardEvent.primary(event, 'k')) {
			startEditing(event);
		} else if (isKeyboardEvent.primaryShift(event, 'k')) {
			unlink();
			richTextRef.current?.focus();
		}
	}

	const blockProps = useBlockProps({
		ref,
		onKeyDown,
	});

	return (
		<div className={className}>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={__('Size', 'surecart')}
							value={size}
							onChange={(size) => {
								setAttributes({ size });
							}}
							options={[
								{
									value: null,
									label: 'Select a Size',
									disabled: true,
								},
								{
									value: 'small',
									label: __('Small', 'surecart'),
								},
								{
									value: 'medium',
									label: __('Medium', 'surecart'),
								},
								{
									value: 'large',
									label: __('Large', 'surecart'),
								},
							]}
						/>
					</PanelRow>
				</PanelBody>
				<WidthPanel
					selectedWidth={width}
					setAttributes={setAttributes}
				/>
			</InspectorControls>

			<div
				{...blockProps}
				className={classnames(blockProps.className, {
					'wp-block-button': true,
					'sc-block-button': true,
					[`has-custom-width sc-block-button__width-${width}`]: width,
					[`has-custom-font-size`]: blockProps.style.fontSize,
				})}
			>
				<RichText
					tag="a"
					aria-label={__('Button text', 'surecart')}
					placeholder={__('Add text…', 'surecart')}
					className={classnames(
						className,
						'wp-block-button__link',
						'sc-block-button__link',
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
						...spacingProps.style,
						textDecoration: 'none',
						display: 'block',
					}}
					onChange={(text) => setAttributes({ text })}
					value={text}
				/>
			</div>
		</div>
	);
};
