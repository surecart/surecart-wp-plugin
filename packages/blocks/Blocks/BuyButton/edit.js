/** @jsx jsx */
import { css, jsx } from '@emotion/core';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
  InspectorControls,
  PanelColorSettings,
	RichText,
	__experimentalUseColorProps as useColorProps,
	__experimentalUseBorderProps as useBorderProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ColorPicker,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScButton } from '@surecart/components-react';
import Placeholder from './Placeholder';
import PriceSelector from '@scripts/blocks/components/PriceSelector';
import PriceInfo from '@scripts/blocks/components/PriceInfo';

export default ({ className, attributes, setAttributes }) => {
	const { price_id, type, label, size, line_items, backgroundColor, textColor } = attributes;
	const borderProps = useBorderProps(attributes);
	const { style: borderStyle } = borderProps;
	const colorProps = useColorProps(attributes);
	const { style: colorStyle } = colorProps;

  if (!price_id) {
		return (
			<div>
				<PriceSelector
					ad_hoc={false}
					onSelect={(price_id) => setAttributes({ price_id })}
				/>
			</div>
		);
	}

	const renderButton = () => {
		if (!line_items || !line_items?.length) {
			return <Placeholder setAttributes={setAttributes} />;
		}

		return (
			<ScButton
				type={type}
				size={size}
				style={{
					...(backgroundColor
						? { '--primary-background': backgroundColor }
						: {}),
					...(textColor
						? { '--primary-color': textColor }
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
		);
	};

	return (
		<div className={className} css={css``}>
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
              onChange: (backgroundColor) => setAttributes({ backgroundColor }),
              label: __('Background Color', 'surecart'),
            },
            {
              value: textColor,
              onChange: (textColor) => setAttributes({ textColor }),
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

			{renderButton()}
		</div>
	);
};
