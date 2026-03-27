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
	const blockProps = useBlockProps({
		className: 'sc-form',
	});
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
		<>
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

			<div {...blockProps}>
				<>
					{price?.ad_hoc && (
						<div class="sc-form-group">
							<RichText
								aria-label={__(
									'Custom amount label',
									'surecart'
								)}
								placeholder={__('Enter a label...', 'surecart')}
								value={ad_hoc_label}
								onChange={(ad_hoc_label) =>
									setAttributes({ ad_hoc_label })
								}
								tagName="label"
								withoutInteractiveFormatting
								allowedFormats={['core/bold', 'core/italic']}
							/>

							<div class="sc-input-group">
								<span
									class="sc-input-group-text"
									id="basic-addon1"
								>
									{price?.currency_symbol ||
										scData?.currency_symbol}
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
							<RichText
								aria-label={__('Help text')}
								placeholder={__('Add help text...')}
								value={help}
								onChange={(help) => setAttributes({ help })}
								tagName="div"
								className="sc-help-text"
								withoutInteractiveFormatting
								allowedFormats={['core/bold', 'core/italic']}
							/>
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
									allowedFormats={[
										'core/bold',
										'core/italic',
									]}
								/>
							</span>
						</button>
					</div>
				</>
			</div>
		</>
	);
};
