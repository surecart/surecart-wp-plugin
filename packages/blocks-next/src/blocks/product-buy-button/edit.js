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
	InspectorControls,
	RichText,
	useBlockProps,
	// __experimentalUseBorderProps as useBorderProps,
	// __experimentalUseColorProps as useColorProps,
	// __experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetElementClassName,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
} from '@wordpress/block-editor';
import { isKeyboardEvent } from '@wordpress/keycodes';
import WidthPanel from '../../components/WidthPanel';

export default (props) => {
	const { attributes, setAttributes, className } = props;
	const { style, text, width, out_of_stock_text, unavailable_text } =
		attributes;

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
	const shadowProps = useShadowProps(attributes);

	const ref = useRef();
	const richTextRef = useRef();
	const blockProps = useBlockProps({
		ref,
		onKeyDown,
	});

	return (
		<>
			<InspectorControls>
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
					ariaLabel={__('Button width')}
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
		</>
	);
};
