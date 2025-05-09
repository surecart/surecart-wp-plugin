/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	AlignmentControl,
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
	__experimentalUseBorderProps as useBorderProps,
	__experimentalUseColorProps as useColorProps,
	__experimentalGetSpacingClassesAndStyles as useSpacingProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	Button,
	ButtonGroup,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ScUpsellCountdownTimer } from '@surecart/components-react';

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

export default ({ attributes, setAttributes }) => {
	const { textAlign, offer_expire_text, show_icon, width, style } =
		attributes;
	const borderProps = useBorderProps(attributes);
	const colorProps = useColorProps(attributes);
	const spacingProps = useSpacingProps(attributes);

	const blockProps = useBlockProps({
		className: classnames({
			[`has-text-align-${textAlign}`]: textAlign,
		}),
	});

	return (
		<>
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
						<ToggleControl
							label={__('Show clock icon', 'surecart')}
							checked={show_icon}
							onChange={() =>
								setAttributes({ show_icon: !show_icon })
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
					'sc-countdown-timer': true,
					[`has-custom-width sc-countdown-timer__width-${width}`]:
						width,
				})}
			>
				<ScUpsellCountdownTimer
					showIcon={show_icon}
					className={classnames(
						colorProps.className,
						borderProps.className,
						{
							[`has-text-align-${textAlign}`]: textAlign,
							'no-border-radius': style?.border?.radius === 0,
						}
					)}
					style={{
						...borderProps.style,
						...colorProps.style,
						...spacingProps.style,
					}}
				>
					<span slot="offer-expire-text">
						<RichText
							tagName="span"
							aria-label={__('Offer Expire text', 'surecart')}
							placeholder={__('Offer Expires in', 'surecart')}
							value={offer_expire_text}
							onChange={(offer_expire_text) =>
								setAttributes({ offer_expire_text })
							}
							withoutInteractiveFormatting
							allowedFormats={['core/bold', 'core/italic']}
						/>
					</span>
				</ScUpsellCountdownTimer>
			</div>
		</>
	);
};
