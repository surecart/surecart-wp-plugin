/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	PanelColorSettings,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { edit } from '@wordpress/icons';

/**
 * Component Dependencies
 */
import Placeholder from './Placeholder';
import PriceInfo from '../../components/PriceInfo';
import { TextControl } from '@wordpress/components';
import { SelectControl } from '@wordpress/components';
import { ScFormatNumber, ScText } from '@surecart/components-react';

export default ({ className, attributes, setAttributes }) => {
	const {
		label,
		line_items,
		backgroundColor,
		textColor,
		amount,
		amount_placement,
	} = attributes;
	const [showChangeProducts, setShowChangeProducts] = useState(false);
	const blockProps = useBlockProps({
		className: 'wp-block-button',
	});

	if (showChangeProducts || !line_items?.length) {
		return (
			<div className={className}>
				<Placeholder
					setAttributes={setAttributes}
					selectedLineItems={line_items}
					setShowChangeProducts={setShowChangeProducts}
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
						label={__('Change selected products', 'surecart')}
						onClick={() => setShowChangeProducts(true)}
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
				<PanelBody title={__('Products Info', 'surecart')}>
					{line_items.map((line_item) => {
						return (
							<PanelRow key={line_item.id}>
								<PriceInfo
									price_id={line_item.id}
									variant_id={line_item.variant_id}
								/>
							</PanelRow>
						);
					})}
				</PanelBody>

				<PanelBody title={__('Amount Settings', 'surecart')}>
					<ScText
						as="p"
						css={css`
							margin-bottom: 10px;
							color: var(--sc-color-gray-500);
						`}
					>
						{__(
							'If you want to show a custom amount, you can set it here.',
							'surecart'
						)}
					</ScText>
					<PanelRow
						css={css`
							flex-direction: column;
							gap: 10px;
							justify-content: flex-start;
							align-items: flex-start;
						`}
					>
						<label htmlFor="amount">
							{__('Amount (in cents)', 'surecart')}
						</label>
						<TextControl
							type="number"
							id="amount"
							name="amount"
							value={amount}
							onChange={(value) =>
								setAttributes({ amount: value })
							}
							min="0"
						/>
					</PanelRow>
					<PanelRow
						css={css`
							flex-direction: column;
							gap: 10px;
							justify-content: flex-start;
							align-items: flex-start;
						`}
					>
						<label htmlFor="amount_placement">
							{__('Amount Placement', 'surecart')}
						</label>
						<SelectControl
							id="amount_placement"
							name="amount_placement"
							value={amount_placement}
							onChange={(value) =>
								setAttributes({
									amount_placement: value,
								})
							}
							disabled={!amount}
						>
							<option value="before">
								{__('Before Button Text', 'surecart')}
							</option>
							<option value="after">
								{__('After Button Text', 'surecart')}
							</option>
						</SelectControl>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
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
					{amount && amount_placement === 'before' && (
						<span
							class="sc-button__link-text"
							style={{ marginRight: 5 }}
						>
							<ScFormatNumber
								type="currency"
								currency="USD"
								value={amount}
							/>
						</span>
					)}

					<span class="sc-button__link-text">
						<RichText
							aria-label={__('Button text')}
							placeholder={__('Add text…')}
							value={label}
							onChange={(label) => setAttributes({ label })}
							withoutInteractiveFormatting
							allowedFormats={['core/bold', 'core/italic']}
						/>
					</span>

					{amount && amount_placement === 'after' && (
						<span
							class="sc-button__link-text"
							style={{ marginLeft: 5 }}
						>
							<ScFormatNumber
								type="currency"
								currency="USD"
								value={amount}
							/>
						</span>
					)}
				</button>
			</div>
		</div>
	);
};
