/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
	RichText,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { edit } from '@wordpress/icons';

/**
 * Component Dependencies
 */
import { ScForm } from '@surecart/components-react';
import PriceInfo from '@scripts/blocks/components/PriceInfo';
import Placeholder from './Placeholder';

export default ({ className, attributes, setAttributes }) => {
	const {
		button_text,
		price_id,
		variant_id,
		ad_hoc_label,
		placeholder,
		help,
		backgroundColor,
		textColor,
	} = attributes;
	const blockProps = useBlockProps();
	const price = useSelect(
		(select) =>
			select(coreStore).getEntityRecord('root', 'price', price_id, {
				expand: ['product'],
			}),
		[price_id, variant_id]
	);

	if (!price_id) {
		return (
			<div {...blockProps}>
				<Placeholder
					selectedPriceId={price_id}
					setAttributes={setAttributes}
				/>
			</div>
		);
	}

	return (
		<div className={className}>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={edit}
						label={__('Change selected product', 'surecart')}
						onClick={() =>
							setAttributes({ price_id: null, variant_id: null })
						}
					/>
				</ToolbarGroup>
			</BlockControls>
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
						<PriceInfo
							price_id={price_id}
							variant_id={variant_id}
						/>
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
					<div>
						<label
							for="sc-product-custom-amount"
							class="sc-form-label"
						>
							{ad_hoc_label || __('Amount', 'surecart')}
						</label>
						<div class="sc-input-group">
							<span
								class="sc-input-group-text"
								id="basic-addon1"
							>
								{scData?.currency_symbol}
							</span>

							<input
								class="sc-form-control"
								id="sc-product-custom-amount"
								type="number"
								required
								placeholder={placeholder}
								min={price?.converted_ad_hoc_min_amount}
								max={price?.converted_ad_hoc_max_amount}
							/>
						</div>
						{help && <div class="sc-help-text">{help}</div>}
					</div>
				)}

				<div className="wp-block-button">
					<button
						type="button"
						class="sc-button wp-element-button wp-block-button__link sc-button__link"
						style={{
							...(backgroundColor
								? {
										backgroundColor: backgroundColor,
								  }
								: {}),
							...(textColor ? { color: textColor } : {}),
						}}
					>
						<span class="sc-button__link-text">
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
						</span>
					</button>
				</div>
			</ScForm>
		</div>
	);
};
