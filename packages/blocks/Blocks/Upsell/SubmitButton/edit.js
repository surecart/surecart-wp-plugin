/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	RichText,
	InspectorControls,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import { isKeyboardEvent } from '@wordpress/keycodes';
import { useRef } from '@wordpress/element';

/**
 * Component Dependencies
 */
import { ScIcon } from '@surecart/components-react';

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
	const {
		text,
		style,
		textAlign,
		show_icon,
		width,
		out_of_stock_text,
		unavailable_text,
	} = attributes;

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
						<ToggleControl
							label={__('Show a secure lock icon.', 'surecart')}
							checked={show_icon}
							onChange={(show_icon) =>
								setAttributes({ show_icon })
							}
						/>
					</PanelRow>
				</PanelBody>

				<PanelBody title={__('Text settings', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Out of stock label', 'surecart')}
							value={out_of_stock_text}
							onChange={(value) =>
								setAttributes({ out_of_stock_text: value })
							}
						/>
					</PanelRow>
					<PanelRow>
						<TextControl
							label={__('Unavailable label', 'surecart')}
							value={unavailable_text}
							onChange={(value) =>
								setAttributes({ unavailable_text: value })
							}
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
				<a
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
				>
					{show_icon && <ScIcon name="lock" size="small"></ScIcon>}{' '}
					<RichText
						tag="span"
						allowedFormats={[]}
						value={text}
						onChange={(text) => setAttributes({ text })}
					/>
				</a>
			</div>
		</div>
	);
};
