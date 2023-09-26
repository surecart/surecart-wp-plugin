/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import {
	Button,
	ButtonGroup,
	PanelBody,
	PanelRow,
	TextControl,
} from '@wordpress/components';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';
import { isKeyboardEvent } from '@wordpress/keycodes';
import useProductPageWarning from '../../../hooks/useProductPageWarning';

function WidthPanel({ selectedWidth, setAttributes }) {
	function handleChange(newWidth) {
		// Check if we are toggling the width off
		const width = selectedWidth === newWidth ? undefined : newWidth;

		// Update attributes.
		setAttributes({ width });
	}

	return (
		<PanelBody title={__('Width settings')}>
			<ButtonGroup aria-label={__('Button width')}>
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

export default (props) => {
	const { attributes, setAttributes, className } = props;
	const { textAlign, style, text, width, outOfStockText } = attributes;

	function onKeyDown(event) {
		if (isKeyboardEvent.primary(event, 'k')) {
			startEditing(event);
		} else if (isKeyboardEvent.primaryShift(event, 'k')) {
			unlink();
			richTextRef.current?.focus();
		}
	}

	// Use internal state instead of a ref to make sure that the component
	// re-renders when the popover's anchor updates.

	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);
	const ref = useRef();
	const richTextRef = useRef();
	const blockProps = useBlockProps({
		ref,
		onKeyDown,
	});

	const warning = useProductPageWarning();
	if (warning) {
		return <div {...blockProps}>{warning}</div>;
	}

	return (
		<>
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
					}}
					value={text}
					onChange={(value) => setAttributes({ text: value })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</div>
			<BlockControls group="block">
				<AlignmentControl
					value={textAlign}
					onChange={(nextAlign) => {
						setAttributes({ textAlign: nextAlign });
					}}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody title={__('Text settings', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Out of stock label', 'surecart')}
							value={outOfStockText}
							onChange={(value) =>
								setAttributes({ outOfStockText: value })
							}
						/>
					</PanelRow>
				</PanelBody>

				<WidthPanel
					selectedWidth={width}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
		</>
	);
};
