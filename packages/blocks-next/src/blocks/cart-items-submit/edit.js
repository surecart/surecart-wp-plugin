/**
 * External dependencies
 */
import classnames from 'classnames';

import {
	RichText,
	useBlockProps,
	__experimentalGetElementClassName,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
	__experimentalGetShadowClassesAndStyles as useShadowProps,
} from '@wordpress/block-editor';
import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default ({ className, attributes, setAttributes }) => {
	const { text, style, width } = attributes;

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
	});

	return (
		<div
			className="sc-cart-items-submit__wrapper"
			style={{
				marginTop: spacingProps?.style?.marginTop,
				marginBottom: spacingProps?.style?.marginBottom,
			}}
		>
			<div className="wp-block-button">
				<div
					{...blockProps}
					className={classnames(blockProps.className, {
						'wp-block-button': true,
						'sc-block-button': true,
						[`has-custom-width sc-block-button__width-${width}`]:
							width,
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
								'has-custom-font-size':
									blockProps.style.fontSize,
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
							fontSize: blockProps.style.fontSize,
						}}
						value={text}
						onChange={(text) => setAttributes({ text })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</div>
			</div>
		</div>
	);
};
