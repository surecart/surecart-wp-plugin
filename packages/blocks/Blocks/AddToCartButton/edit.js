/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
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
import { ScButton, ScForm, ScPriceInput } from '@surecart/components-react';
import PriceSelector from '@scripts/blocks/components/PriceSelector';
import PriceInfo from '@scripts/blocks/components/PriceInfo';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

export default ({ className, attributes, setAttributes }) => {
	const {
		type,
		button_text,
		size,
		price_id,
		ad_hoc_label,
		placeholder,
		help,
		backgroundColor,
		textColor,
	} = attributes;
	const borderProps = useBorderProps(attributes);
	const { style: borderStyle } = borderProps;
	const colorProps = useColorProps(attributes);
	const { style: colorStyle } = colorProps;
	const blockProps = useBlockProps();
	const price = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'price', price_id),
		[price_id]
	);

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
					{price?.ad_hoc && (
						<>
							<PanelRow>
								<TextControl
									label={__('Input Label', 'surecart')}
									value={ad_hoc_label}
									onChange={(ad_hoc_label) =>
										setAttributes({ ad_hoc_label })
									}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__('Input Help', 'surecart')}
									value={help}
									onChange={(help) => setAttributes({ help })}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__('Input Placeholder', 'surecart')}
									value={placeholder}
									onChange={(placeholder) =>
										setAttributes({ placeholder })
									}
								/>
							</PanelRow>
						</>
					)}
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={button_text}
							onChange={(button_text) =>
								setAttributes({ button_text })
							}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={__('Button Size', 'surecart')}
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
							label={__('Button Type', 'surecart')}
							value={type}
							onChange={(type) => {
								setAttributes({ type });
							}}
							options={[
								{
									value: 'primary',
									label: __('Primary Button', 'surecart'),
								},
								{
									value: 'default',
									label: __('Secondary Button', 'surecart'),
								},
								{
									value: 'text',
									label: __('Text Link', 'surecart'),
								},
							]}
						/>
					</PanelRow>
				</PanelBody>
				<PanelColorSettings
					title={__('Color Settings')}
					colorSettings={[
						{
							value: backgroundColor,
							onChange: (backgroundColor) =>
								setAttributes({ backgroundColor }),
							label: __('Background Color', 'surecart'),
						},
						{
							value: textColor,
							onChange: (textColor) =>
								setAttributes({ textColor }),
							label: __('Text Color', 'surecart'),
						},
					]}
				></PanelColorSettings>
				<PanelBody title={__('Product Info', 'surecart')}>
					<PanelRow>
						<PriceInfo price_id={price_id} />
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<ScForm
				style={{
					...(backgroundColor
						? {
								'--sc-color-primary-500': backgroundColor,
								'--sc-focus-ring-color-primary':
									backgroundColor,
								'--sc-input-border-color-focus':
									backgroundColor,
						  }
						: {}),
					...(textColor
						? { '--sc-color-primary-text': textColor }
						: {}),
				}}
			>
				{price?.ad_hoc && (
					<ScPriceInput
						currencyCode={price.currency}
						label={ad_hoc_label}
						placeholder={placeholder}
						required
						help={help}
						name="price"
					/>
				)}

				<ScButton type={type} size={size}>
					<RichText
						aria-label={__('Button text')}
						placeholder={__('Add text…')}
						value={button_text}
						onChange={(button_text) =>
							setAttributes({ button_text })
						}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</ScButton>
			</ScForm>
		</div>
	);
};
