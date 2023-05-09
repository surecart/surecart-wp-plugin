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
import { createBlock } from '@wordpress/blocks';
import { ScButton } from '@surecart/components-react';

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
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
		onReplace,
		mergeBlocks,
	} = props;
	const { textAlign, placeholder, rel, style, text, width, type } =
		attributes;

	console.log(attributes?.className);
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

	console.log({ colorProps, borderProps, spacingProps });
	return (
		<>
			<div
				{...blockProps}
				className={classnames(blockProps.className, {
					'wp-block-button': true,
					[`has-custom-width wp-block-button__width-${width}`]: width,
					[`has-custom-font-size`]: blockProps.style.fontSize,
				})}
				style={{
					'--sc-button-background-color':
						colorProps?.style?.backgroundColor,
					'--sc-button-text-color': colorProps?.style?.color,
					'--sc-button-border-color': colorProps?.style?.borderColor,
					'--sc-button-border-radius':
						borderProps?.style?.borderRadius,
					'--sc-button-border-width': borderProps?.style?.borderWidth,
					'--sc-button-border-style': borderProps?.style?.borderStyle,
					'--sc-button-border-color': borderProps?.style?.borderColor,
					border: 'none',
				}}
			>
				<ScButton type="primary" full={width ? true : false}>
					<RichText
						aria-label={__('Button text')}
						placeholder={__('Add text…')}
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</ScButton>
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
				<WidthPanel
					selectedWidth={width}
					setAttributes={setAttributes}
				/>
			</InspectorControls>
		</>
	);
};
