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

export default ({ className, attributes, setAttributes }) => {
	const { label, line_items, backgroundColor, textColor } = attributes;
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
				</button>
			</div>
		</div>
	);
};
