/** @jsx jsx */
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
import { CeButton } from '@checkout-engine/components-react';

export default ({ className, attributes, setAttributes }) => {
	const { type, label, submit, size, show_icon, full } = attributes;

	return (
		<div className={className} css={css``}>
			<InspectorControls>
				<PanelBody title={__('Attributes', 'checkout-engine')}>
					<PanelRow>
						<TextControl
							label={__('Button Text', 'checkout-engine')}
							value={label}
							onChange={(label) => setAttributes({ label })}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							checked={show_icon}
							label={__('Show Icon', 'checkout-engine')}
							onChange={(show_icon) =>
								setAttributes({ show_icon })
							}
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={__('Full', 'checkout-engine')}
							checked={full}
							onChange={(full) => setAttributes({ full })}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={__('Size', 'checkout_engine')}
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
									label: __('Small', 'checkout_engine'),
								},
								{
									value: 'medium',
									label: __('Medium', 'checkout_engine'),
								},
								{
									value: 'large',
									label: __('Large', 'checkout_engine'),
								},
							]}
						/>
					</PanelRow>
					<PanelRow>
						<SelectControl
							label={__('Type', 'checkout_engine')}
							value={type}
							onChange={(type) => {
								setAttributes({ type });
							}}
							options={[
								{
									value: 'primary',
									label: __('Button', 'checkout_engine'),
								},
								{
									value: 'info',
									label: __('Info', 'checkout_engine'),
								},
							]}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<CeButton type={type} submit={submit} size={size} full={full}>
				{show_icon && (
					<ce-icon
						name="user"
						style={{ fontSize: '18px' }}
						slot="prefix"
					></ce-icon>
				)}

				<RichText
					aria-label={__('Button text')}
					placeholder={__('Add text…')}
					value={label}
					onChange={(label) => setAttributes({ label })}
					withoutInteractiveFormatting
					allowedFormats={['core/bold', 'core/italic']}
				/>
			</CeButton>
		</div>
	);
};
