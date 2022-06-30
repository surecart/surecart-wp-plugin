/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	RichText,
	__experimentalUseColorProps as useColorProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScButton } from '@surecart/components-react';
import PriceSelector from '@scripts/blocks/components/PriceSelector';

export default ({ className, attributes, setAttributes }) => {
	const { type, label, size, price_id } = attributes;
	const borderProps = useBorderProps(attributes);
	const { style: borderStyle } = borderProps;
	const colorProps = useColorProps(attributes);
	const { style: colorStyle } = colorProps;
	const blockProps = useBlockProps();

	if (!price_id) {
		return (
			<div {...blockProps}>
				<PriceSelector
					onSelect={(price_id) => setAttributes({ price_id })}
				/>
			</div>
		);
	}

	return (
		<div className={className}>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={label}
							onChange={(label) => setAttributes({ label })}
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
					<PanelRow>
						<SelectControl
							label={__('Type', 'surecart')}
							value={type}
							onChange={(type) => {
								setAttributes({ type });
							}}
							options={[
								{
									value: 'primary',
									label: __('Button', 'surecart'),
								},
								{
									value: 'text',
									label: __('Text Link', 'surecart'),
								},
							]}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScButton
				type={type}
				size={size}
				style={{
					...(colorStyle?.backgroundColor
						? { '--primary-background': colorStyle.backgroundColor }
						: {}),
					...(colorStyle?.background
						? { '--primary-background': colorStyle.background }
						: {}),
					...(colorStyle?.color
						? { '--primary-color': colorStyle.color }
						: {}),
					...(borderStyle?.borderRadius
						? { '--button-border-radius': borderStyle.borderRadius }
						: {}),
				}}
			>
				<RichText
					aria-label={__('Button text')}
					placeholder={__('Add text…')}
					value={label}
					onChange={(label) => setAttributes({ label })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</ScButton>
		</div>
	);
};
