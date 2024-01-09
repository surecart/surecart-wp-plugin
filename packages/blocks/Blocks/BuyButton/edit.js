/** @jsx jsx */
import { css, jsx } from '@emotion/core';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	PanelColorSettings,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { edit } from '@wordpress/icons';

/**
 * Component Dependencies
 */
import { ScButton } from '@surecart/components-react';
import Placeholder from './Placeholder';
import PriceInfo from '../../components/PriceInfo';

export default ({ className, attributes, setAttributes }) => {
	const { type, label, size, line_items, backgroundColor, textColor } =
		attributes;
	const [showChangeProducts, setShowChangeProducts] = useState(false);

	const renderButton = () => {
		return (
			<ScButton
				type={type}
				size={size}
				style={{
					...(backgroundColor
						? { '--primary-background': backgroundColor }
						: {}),
					...(textColor ? { '--primary-color': textColor } : {}),
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
		);
	};

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

			{renderButton()}
		</div>
	);
};
