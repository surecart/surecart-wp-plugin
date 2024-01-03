/**
 * @jsx jsx
 */
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { RichText } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Component Dependencies
 */
import { ScButton, ScFormatNumber } from '@surecart/components-react';

export default ({ className, attributes, setAttributes }) => {
	const { type, text, full, size } = attributes;

	return (
		<div className={className}>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'surecart')}>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'surecart')}
							value={text}
							onChange={(text) => setAttributes({ text })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Full', 'surecart')}
							checked={full}
							onChange={(full) => setAttributes({ full })}
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
				</PanelBody>
			</InspectorControls>

			<div
				css={css`
					display: block;
					width: auto;
					display: grid;
					gap: var(--sc-form-row-spacing);
				`}
			>
				<ScButton
					type={type}
					submit={false}
					{...(full ? { full: true } : {})}
					size={size}
				>
					<RichText
						aria-label={__('No Thanks Button text')}
						placeholder={__('Add text…')}
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						withoutInteractiveFormatting
						allowedFormats={['core/bold', 'core/italic']}
					/>
				</ScButton>
			</div>
		</div>
	);
};
