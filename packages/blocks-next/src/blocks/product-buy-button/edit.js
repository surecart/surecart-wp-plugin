/**
 * External dependencies.
 */
import classnames from 'classnames';

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
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
import { select, useDispatch } from '@wordpress/data';
import { isKeyboardEvent } from '@wordpress/keycodes';

/**
 * Internal dependencies.
 */
import WidthPanel from '../../components/WidthPanel';

export default ({ attributes, setAttributes, className }) => {
	const {
		style,
		text,
		width,
		out_of_stock_text,
		unavailable_text,
		show_sticky_purchase_button,
		show_sticky_purchase_on_out_of_stock,
	} = attributes;

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

				<PanelBody title={__('Sticky purchase button', 'surecart')}>
					<PanelRow>
						<ToggleControl
							label={__(
								'Show sticky purchase button',
								'surecart'
							)}
							checked={show_sticky_purchase_button}
							onChange={toggleStickyPurchaseButton}
							help={__(
								'Show a sticky purchase button when the main buy buttons are out of view',
								'surecart'
							)}
						/>
					</PanelRow>

					{show_sticky_purchase_button && (
						<PanelRow>
							<ToggleControl
								label={__(
									'Show sticky purchase button on out of stock products',
									'surecart'
								)}
								checked={show_sticky_purchase_on_out_of_stock}
								onChange={(value) =>
									setAttributes({
										show_sticky_purchase_on_out_of_stock:
											value,
									})
								}
								help={__(
									'Show the sticky purchase button even when the product is out of stock',
									'surecart'
								)}
							/>
						</PanelRow>
					)}
				</PanelBody>
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
					ref={richTextRef}
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
